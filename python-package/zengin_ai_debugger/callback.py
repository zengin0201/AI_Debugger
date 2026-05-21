import json
import httpx
from uuid import UUID
from typing import Any, Dict, Optional
from langchain_core.callbacks import AsyncCallbackHandler

class RealUIDebuggerCallback(AsyncCallbackHandler):
    def __init__(self, server_url="http://localhost:8000"):
        self.server_url = f"{server_url}/api/track"

    async def _send(self, data: dict):
        async with httpx.AsyncClient() as client:
            try:
                await client.post(self.server_url, json=data)
            except Exception as e:
                pass 

    async def _add_node_with_edge(self, run_id: str, label: str, parent_run_id: Optional[UUID] = None, inputs: Any = None):
        # Отправляем ноду
        await self._send({
            "type": "node_added", 
            "id": run_id, 
            "label": label, 
            "status": "running",
            "inputs": str(inputs) if inputs else "Без входа"
        })
        
        if parent_run_id:
            await self._send({
                "type": "edge_added", 
                "source": str(parent_run_id), 
                "target": run_id
            })

    async def on_chain_start(
        self, serialized: Optional[Dict[str, Any]], inputs: Dict[str, Any], *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs: Any
    ):
        node_name = "Chain"
        if serialized and isinstance(serialized, dict):
            node_name = serialized.get("name", "Chain")
        elif hasattr(serialized, "name"):
            node_name = serialized.name

        if node_name == "RunnableSequence":
            return

        await self._add_node_with_edge(str(run_id), f"{node_name}", parent_run_id, inputs)

    async def on_chat_model_start(
        self, serialized: Dict[str, Any], messages: list, *, run_id: UUID, parent_run_id: Optional[UUID] = None, **kwargs: Any
    ):
        prompt_text = str(messages[0]) if messages else "Пустой промпт"
        await self._add_node_with_edge(str(run_id), "LLM Model (Нейросеть)", parent_run_id, prompt_text)

    async def on_chain_end(self, outputs: Dict[str, Any], *, run_id: UUID, **kwargs: Any):
        await self._send({
            "type": "node_updated", 
            "id": str(run_id), 
            "status": "success",
            "outputs": str(outputs) 
        })

    async def on_llm_end(self, response: Any, *, run_id: UUID, **kwargs: Any):
        llm_text = response.generations[0][0].text if response.generations else str(response)
        await self._send({
            "type": "node_updated", 
            "id": str(run_id), 
            "status": "success",
            "outputs": llm_text 
        })