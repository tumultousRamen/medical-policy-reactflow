import React from 'react';
import { Handle, Position } from 'reactflow';

const DownloadNode = ({ data }) => {
  const downloadJson = () => {
    if (!data.policyData) return;

    const blob = new Blob([JSON.stringify(data.policyData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `policy-analysis-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-3 rounded-md shadow-lg bg-white min-w-[300px]">
      <Handle type="target" position={Position.Top} />
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Download Results</h3>
        
        <button
          onClick={downloadJson}
          disabled={!data.policyData}
          className={`w-full p-2 rounded ${
            data.policyData 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Download JSON
        </button>

        {data.policyData && (
          <div className="mt-4 text-sm text-gray-600">
            <div>Data ready for download</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadNode;