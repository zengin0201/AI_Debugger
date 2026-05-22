import { useEffect, useState, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  addEdge, 
  useNodesState, 
  useEdgesState,
  ConnectionLineType,
  MarkerType,
  Position
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

import type { Node, Edge } from 'reactflow';
import type { WsMessage } from './types';

const nodeWidth = 220;
const nodeHeight = 60;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));


const getLayoutedElements = (nodes: Node[], edges: Edge[]): Node[] => {
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [statusText, setStatusText] = useState("Waiting for agents...");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const isExtension = window.location.protocol === 'chrome-extension:';
    const wsUrl = (import.meta.env.DEV || isExtension) 
      ? 'ws://localhost:8000/ws/debug' 
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/debug`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => setStatusText("🟢 Socket Connected. Run Python script.");
    ws.current.onclose = () => setStatusText("🔴 Socket Disconnected");

    ws.current.onmessage = (event) => {
      const data: WsMessage = JSON.parse(event.data);

      if (data.type === 'node_added' && data.id && data.label) {
        const newNode: Node = { 
          id: data.id, 
          position: { x: 0, y: 0 }, 
          data: { label: data.label, inputs: data.inputs, outputs: "Processing..." },
          style: { background: '#ffcc00', color: '#000', borderRadius: '8px', width: nodeWidth, border: '2px solid #222', fontWeight: 'bold' }
        };
        setNodes((nds) => [...nds, newNode]);
      } 
      
      else if (data.type === 'edge_added' && data.source && data.target) {
        setEdges((eds) => {
          const newEdge: Edge = { 
            id: `e${data.source}-${data.target}`, 
            source: data.source!, 
            target: data.target!, 
            animated: true,
            type: ConnectionLineType.SmoothStep,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#4a90e2' },
            style: { stroke: '#4a90e2', strokeWidth: 2 }
          };
          const updatedEdges = addEdge(newEdge, eds);
          
          setNodes((currentNodes) => getLayoutedElements(currentNodes, updatedEdges));
          
          return updatedEdges;
        });
      } 
      
      else if (data.type === 'node_updated' && data.id) {
        setNodes((nds) => nds.map((n) => {
          if (n.id === data.id) {
            return { 
              ...n, 
              data: { ...n.data, outputs: data.outputs || n.data.outputs },
              style: { ...n.style, background: data.status === 'success' ? '#4CAF50' : '#F44336', color: 'white' } 
            };
          }
          return n;
        }));
      }
    };

    return () => ws.current?.close();
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#0f172a' }}>
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: 'rgba(30, 41, 59, 0.9)', padding: '16px', borderRadius: '12px', border: '1px solid #334155', color: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h3 style={{margin: 0, fontSize: '14px', letterSpacing: '0.05em'}}>AI VISUAL DEBUGGER</h3>
          <p style={{color: "#10b981", fontSize: '11px', margin: '4px 0 12px 0', fontWeight: '600'}}>{statusText}</p>
          <button 
            onClick={() => {setNodes([]); setEdges([]); setSelectedNode(null);}} 
            style={{background: '#3b82f6', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}
          >
            Clear Canvas
          </button>
        </div>

        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onNodeClick={(_, node) => setSelectedNode(node)}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Background color="#1e293b" gap={25} />
          <Controls />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div style={{ width: '400px', background: '#1e293b', color: 'white', padding: '24px', borderLeft: '1px solid #334155', overflowY: 'auto' }}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
            <h2 style={{fontSize: '16px', color: '#60a5fa', margin: 0}}>{selectedNode.data.label}</h2>
            <button onClick={() => setSelectedNode(null)} style={{background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize: '20px'}}>✕</button>
          </div>
          <div style={{marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div>
              <label style={{color: '#94a3b8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase'}}>INPUT</label>
              <pre style={{background: '#0f172a', padding: '12px', borderRadius: '8px', fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap', border: '1px solid #334155'}}>{selectedNode.data.inputs}</pre>
            </div>
            <div>
              <label style={{color: '#94a3b8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase'}}>OUTPUT</label>
              <pre style={{background: '#0f172a', padding: '12px', borderRadius: '8px', fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap', color: '#34d399', border: '1px solid #334155'}}>{selectedNode.data.outputs}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
