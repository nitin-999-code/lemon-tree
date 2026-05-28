import React, { useState } from 'react';
import { askQuestion } from '../api';
import { Send, Loader2, AlertCircle } from 'lucide-react';

const QuestionBox = ({ onAnswerReceived }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await askQuestion(question);
      onAnswerReceived(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="question" className="font-semibold text-slate-800 text-lg">
          Ask a Question
        </label>
        <div className="flex gap-2">
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What is the main topic of the document?"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 text-slate-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="px-6 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-900 disabled:opacity-50 flex items-center justify-center transition-colors min-w-[120px]"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Ask</>}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default QuestionBox;
