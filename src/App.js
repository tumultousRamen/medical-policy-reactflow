import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import PDFProcessorNode from './components/PDFProcessorNode';
import DownloadNode from './components/DownloadNode';

const nodeTypes = {
  pdfProcessor: PDFProcessorNode,
  downloadNode: DownloadNode,
};

const initialNodes = [
  {
    id: 'pdf-input',
    type: 'pdfProcessor',
    data: { label: 'PDF Upload' },
    position: { x: 250, y: 25 },
  },
  {
    id: 'download-output',
    type: 'downloadNode',
    data: { label: 'Download Results' },
    position: { x: 250, y: 225 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'pdf-input', target: 'download-output' },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handlePolicyDataExtracted = (extractedData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'download-output') {
          return {
            ...node,
            data: {
              ...node.data,
              policyData: extractedData,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes.map(node => 
          node.id === 'pdf-input' 
            ? { 
                ...node, 
                data: { 
                  ...node.data, 
                  onDataExtracted: handlePolicyDataExtracted 
                } 
              } 
            : node
        )}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;