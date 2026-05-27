import json
import re
import time
import requests
from uuid import UUID
from typing import Any, Dict, Optional, List
from langchain_core.callbacks import BaseCallbackHandler

PRICE_PER_1K_PROMPT = 0.00015    #PLACE YOUR PRICE OF AI
PRICE_PER_1K_COMPLETION = 0.0006 #PLACE YOUR PRICE OF AI
def mask_pii(data: Any) -> str:
    """Маскировка конфиденциальных данных (PII) и форматирование в JSON"""
    if not data: 
        return ""
    if isinstance(data, (dict, list)):
        try:
            text = json.dumps(data, ensure_ascii=False)
        except:
            text = str(data)
    else:
        text = str(data)
        
    text = re.sub(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', '[EMAIL MASKED]', text)
    text = re.sub(r'\b(?:\d[ -]*?){13,16}\b', '[CARD MASKED]', text)
    return text

class RealUIDebuggerCallback(BaseCallbackHandler):
    def __init__(self, server_url="http://localhost:8000"):
        self.server_url = f"{server_url}/api/track"
        self.start_times = {}

    def _send(self, data: dict):
        """Синхронная отправка данных на Node.js сервер UI"""
        try:
            requests.post(self.server_url, json=data, timeout=2.0)
        except Exception:
            pass 

    def _get_node_name(self, serialized: Dict[str, Any], kwargs: Dict[str, Any], fallback: str = "Chain") -> str:
        """Умный парсинг имени ноды"""
        if kwargs and kwargs.get("name"):
            return kwargs["name"]
        if serialized:
            if "name" in serialized and serialized["name"]:
                return serialized["name"]
            if "id" in serialized and isinstance(serialized["id"], list) and len(serialized["id"]) > 0:
                return serialized["id"][-1]
                
        return fallback

    def on_chain_start(self, serialized: Dict[str, Any], inputs: Dict[str, Any], *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs: Any):
        name = self._get_node_name(serialized, kwargs)
        
        if name in ["RunnableSequence", "RunnableParallel"] and not kwargs.get("name"): 
            return
            
        self.start_times[str(run_id)] = time.time()
        masked_inputs = mask_pii(inputs)
        
        self._send({"type": "node_added", "id": str(run_id), "label": name, "status": "running", "inputs": masked_inputs})
        if parent_run_id:
            self._send({"type": "edge_added", "source": str(parent_run_id), "target": str(run_id)})

    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs: Any):
        name = self._get_node_name(serialized, kwargs, "LLM")
        self.start_times[str(run_id)] = time.time()
        prompt_text = mask_pii(prompts[0] if prompts else "")
        
        self._send({"type": "node_added", "id": str(run_id), "label": f"🧠 {name}", "status": "running", "inputs": prompt_text})
        if parent_run_id:
            self._send({"type": "edge_added", "source": str(parent_run_id), "target": str(run_id)})

    def on_chat_model_start(self, serialized: Dict[str, Any], messages: List[List[Any]], *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs: Any):
        name = self._get_node_name(serialized, kwargs, "Chat Model")
        self.start_times[str(run_id)] = time.time()
        prompt_text = mask_pii(messages[0][0].content if messages and messages[0] else str(messages))
        
        self._send({"type": "node_added", "id": str(run_id), "label": f"🧠 {name}", "status": "running", "inputs": prompt_text})
        if parent_run_id:
            self._send({"type": "edge_added", "source": str(parent_run_id), "target": str(run_id)})

    def on_tool_start(self, serialized: Dict[str, Any], input_str: str, *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs: Any):
        name = self._get_node_name(serialized, kwargs, "Tool")
        self.start_times[str(run_id)] = time.time()
        
        self._send({"type": "node_added", "id": str(run_id), "label": f"🛠 {name}", "status": "tool", "inputs": mask_pii(input_str)})
        if parent_run_id:
            self._send({"type": "edge_added", "source": str(parent_run_id), "target": str(run_id)})

    def on_llm_new_token(self, token: str, *, run_id: UUID, **kwargs: Any):
        self._send({"type": "token_streamed", "id": str(run_id), "message": token})

    def on_chain_end(self, outputs: Dict[str, Any], *, run_id: UUID, **kwargs: Any):
        duration = time.time() - self.start_times.get(str(run_id), time.time())
        self._send({"type": "node_updated", "id": str(run_id), "status": "success", "outputs": mask_pii(outputs), "duration": duration})

    def on_llm_end(self, response: Any, *, run_id: UUID, **kwargs: Any):
        duration = time.time() - self.start_times.get(str(run_id), time.time())
        llm_output = response.generations[0][0].text if response.generations else str(response)
        token_usage = response.llm_output.get("token_usage", {}) if response.llm_output else {}
        pt = token_usage.get("prompt_tokens", len(str(response)) // 4) 
        ct = token_usage.get("completion_tokens", len(llm_output) // 4)
        cost = (pt / 1000 * PRICE_PER_1K_PROMPT) + (ct / 1000 * PRICE_PER_1K_COMPLETION)

        payload = {
            "type": "node_updated", 
            "id": str(run_id), 
            "status": "success", 
            "outputs": mask_pii(llm_output), 
            "duration": duration,
            "tokens": {"prompt": pt, "completion": ct, "total": pt + ct},
            "cost": cost
        }
        self._send(payload)

    def on_tool_end(self, output: str, *, run_id: UUID, **kwargs: Any):
        duration = time.time() - self.start_times.get(str(run_id), time.time())
        self._send({"type": "node_updated", "id": str(run_id), "status": "tool", "outputs": mask_pii(output), "duration": duration})

    def _handle_error(self, error: Exception, run_id: UUID):
        duration = time.time() - self.start_times.get(str(run_id), time.time())
        self._send({
            "type": "node_updated", 
            "id": str(run_id), 
            "status": "error", 
            "error": f"{type(error).__name__}: {str(error)}",
            "duration": duration
        })

    def on_chain_error(self, error: Exception, *, run_id: UUID, **kwargs: Any): 
        self._handle_error(error, run_id)
        
    def on_llm_error(self, error: Exception, *, run_id: UUID, **kwargs: Any): 
        self._handle_error(error, run_id)
        
    def on_tool_error(self, error: Exception, *, run_id: UUID, **kwargs: Any): 
        self._handle_error(error, run_id)