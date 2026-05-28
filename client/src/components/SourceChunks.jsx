import React from 'react';
import { FileText } from 'lucide-react';

const SourceChunks = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-700 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Retrieved Context Sources
      </h3>
      
      <div className="grid gap-4">
        {sources.map((source, index) => (
          <div key={source.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-xs">
                Source {index + 1}
              </span>
              <span className="text-slate-400 text-xs">
                Similarity: {(source.similarity * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-slate-600 italic">"{source.chunkText}"</p>
            <p className="mt-2 text-xs text-slate-400 font-medium">File: {source.fileName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceChunks;
