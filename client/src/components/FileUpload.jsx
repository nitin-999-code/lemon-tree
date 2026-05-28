import React, { useState, useRef } from 'react';
import { uploadDocument } from '../api';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
        setFile(selectedFile);
        setStatus('idle');
        setMessage('');
      } else {
        setStatus('error');
        setMessage('Please select a PDF or TXT file.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    try {
      const result = await uploadDocument(file);
      setStatus('success');
      setMessage(`Successfully processed ${result.fileName}. Extracted ${result.chunksCreated} text chunks.`);
      onUploadSuccess();
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to upload document.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-12 h-12 text-slate-400 mb-3" />
        <p className="font-medium text-slate-700">Click to select PDF or TXT</p>
        <p className="text-sm text-slate-500 mt-1">
          {file ? file.name : "No file selected"}
        </p>
        <input 
          type="file" 
          accept=".pdf,.txt" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || status === 'uploading'}
        className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors w-full justify-center"
      >
        {status === 'uploading' ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
        ) : (
          'Upload & Process Document'
        )}
      </button>

      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 w-full text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 w-full text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
