import { useEffect, useState, useRef } from 'react';
import ReactFlow, { Background, Controls, addEdge, useNodesState, useEdgesState, ConnectionLineType, MarkerType, Position, type Node, type Edge } from 'reactflow';
import dagre from 'dagre';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'reactflow/dist/style.css';
import type { WsMessage } from './types';

const nodeWidth = 250;
const nodeHeight = 70;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes: Node[], edges: Edge[]): Node[] => {
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node, targetPosition: Position.Top, sourcePosition: Position.Bottom,
      position: { x: nodeWithPosition.x - nodeWidth / 2, y: nodeWithPosition.y - nodeHeight / 2 },
    };
  });
};

const getStatusColor = (status: string) => {
  if (status === 'error') return '#ef4444'; // Red
  if (status === 'success') return '#10b981'; // Green
  if (status === 'tool') return '#8b5cf6'; // Purple
  return '#f59e0b'; // Yellow (running)
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [statusText, setStatusText] = useState("Waiting for agents...");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8000/ws/debug`);
    ws.current.onopen = () => setStatusText("🟢 Socket Connected.");
    ws.current.onclose = () => setStatusText("🔴 Socket Disconnected");

    ws.current.onmessage = (event) => {
      const data: WsMessage = JSON.parse(event.data);

      if (data.type === 'node_added' && data.id) {
        const newNode: Node = { 
          id: data.id, position: { x: 0, y: 0 }, 
          data: { ...data, outputs: "Processing..." },
          style: { background: getStatusColor(data.status || 'running'), color: '#fff', borderRadius: '8px', width: nodeWidth, border: '2px solid #1e293b', fontWeight: 'bold' }
        };
        setNodes((nds) => [...nds, newNode]);
      } 
      else if (data.type === 'edge_added' && data.source && data.target) {
        setEdges((eds) => {
          const newEdge: Edge = { 
            id: `e${data.source}-${data.target}`, source: data.source!, target: data.target!, animated: true,
            type: ConnectionLineType.SmoothStep, markerEnd: { type: MarkerType.ArrowClosed, color: '#4a90e2' }, style: { stroke: '#4a90e2', strokeWidth: 2 }
          };
          const updatedEdges = addEdge(newEdge, eds);
          setNodes((currentNodes) => getLayoutedElements(currentNodes, updatedEdges));
          return updatedEdges;
        });
      } 
      else if (data.type === 'token_streamed' && data.id) {
        setNodes((nds) => nds.map((n) => {
          if (n.id === data.id) {
            const newOutput = (n.data.outputs === "Processing..." ? "" : n.data.outputs) + data.message;
            return { ...n, data: { ...n.data, outputs: newOutput }};
          }
          return n;
        }));
      }
      else if (data.type === 'node_updated' && data.id) {
        setNodes((nds) => nds.map((n) => {
          if (n.id === data.id) {
            return { 
              ...n, 
              data: { ...n.data, ...data },
              style: { ...n.style, background: getStatusColor(data.status || 'success') } 
            };
          }
          return n;
        }));
      }
    };
    return () => ws.current?.close();
  }, [setNodes, setEdges]);

  const filteredNodes = nodes.map(n => ({
    ...n,
    style: { ...n.style, opacity: searchTerm && !n.data.label?.toLowerCase().includes(searchTerm.toLowerCase()) ? 0.2 : 1 }
  }));

  const safeJsonParse = (str: string) => {
    try { return JSON.stringify(JSON.parse(str), null, 2); } 
    catch { return str; }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#0f172a' }}>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(30, 41, 59, 0.9)', padding: '16px', borderRadius: '12px', border: '1px solid #334155', color: 'white' }}>
          <h3 style={{margin: 0, fontSize: '14px'}}>AI VISUAL DEBUGGER</h3>
          <p style={{color: "#10b981", fontSize: '11px', margin: '4px 0 12px 0'}}>{statusText}</p>
          <input 
            type="text" placeholder="Search nodes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{width: '100%', marginBottom: '10px', padding: '6px', borderRadius: '4px', border: 'none', background: '#1e293b', color: 'white'}}
          />
          <button onClick={() => {setNodes([]); setEdges([]); setSelectedNode(null);}} style={{background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>Clear</button>
        </div>

        <ReactFlow nodes={filteredNodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onNodeClick={(_, node) => setSelectedNode(node)} fitView>
          <Background color="#1e293b" gap={25} />
          <Controls />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div style={{ width: '450px', background: '#1e293b', color: 'white', padding: '24px', borderLeft: '1px solid #334155', overflowY: 'auto' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h2 style={{fontSize: '18px', margin: 0}}>{selectedNode.data.label}</h2>
            <button onClick={() => setSelectedNode(null)} style={{background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize: '20px'}}>✕</button>
          </div>

          <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
             <button style={{background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'}} onClick={() => alert("Breakpoints require LangGraph Checkpointer integration.")}>⏸ Breakpoint</button>
             <button style={{background: '#8b5cf6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'}} onClick={() => alert("Re-run starting from this node state (WIP)")}>🔄 Re-run from here</button>
          </div>


          {selectedNode.data.duration && (
            <div style={{background: '#0f172a', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px'}}>
              <div>⏱ Duration: {(selectedNode.data.duration).toFixed(2)}s</div>
              {selectedNode.data.tokens && (
                <>
                  <div style={{marginTop: '4px'}}>🪙 Tokens: {selectedNode.data.tokens.total} (P: {selectedNode.data.tokens.prompt}, C: {selectedNode.data.tokens.completion})</div>
                  <div style={{marginTop: '4px', color: '#10b981'}}>💰 Est. Cost: ${selectedNode.data.cost?.toFixed(5)}</div>
                </>
              )}
            </div>
          )}

          {selectedNode.data.error && (
            <div style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px'}}>
              <h4 style={{color: '#ef4444', margin: '0 0 8px 0'}}>Stack Trace / Error</h4>
              <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{fontSize: '11px', background: 'transparent'}}>{selectedNode.data.error}</SyntaxHighlighter>
            </div>
          )}

          <div>
            <label style={{color: '#94a3b8', fontSize: '11px', fontWeight: '800'}}>INPUT</label>
            <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{fontSize: '12px', borderRadius: '8px', border: '1px solid #334155'}}>{safeJsonParse(selectedNode.data.inputs)}</SyntaxHighlighter>
          </div>
          <div style={{marginTop: '16px'}}>
            <label style={{color: '#94a3b8', fontSize: '11px', fontWeight: '800'}}>OUTPUT</label>
            <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{fontSize: '12px', borderRadius: '8px', border: '1px solid #334155'}}>{safeJsonParse(selectedNode.data.outputs)}</SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}
