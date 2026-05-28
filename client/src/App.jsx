import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import QuestionBox from './components/QuestionBox';
import AnswerBox from './components/AnswerBox';
import SourceChunks from './components/SourceChunks';
import { BookOpen } from 'lucide-react';

function App() {
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [answerData, setAnswerData] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-800">RAG Document Assistant</h1>
        </div>
        <p className="text-slate-500">Upload a PDF or TXT and ask questions based on its content.</p>
      </header>

      <main className="w-full max-w-3xl space-y-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <FileUpload onUploadSuccess={() => setDocumentUploaded(true)} />
        </div>

        {documentUploaded && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <QuestionBox onAnswerReceived={(data) => setAnswerData(data)} />
            
            {answerData && (
              <div className="space-y-6 mt-8 border-t border-slate-100 pt-6">
                <AnswerBox answer={answerData.answer} />
                <SourceChunks sources={answerData.sources} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
