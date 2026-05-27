export interface WsMessage {
  type: 'node_added' | 'node_updated' | 'edge_added' | 'token_streamed' | 'agent_paused' | 'agent_finished';
  id?: string;
  label?: string;
  status?: 'running' | 'success' | 'error' | 'tool';
  source?: string;
  target?: string;
  message?: string;
  inputs?: string;  
  outputs?: string;
  error?: string;
  duration?: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;
}
