import React from 'react';
import { Sparkles } from 'lucide-react';

const AnswerBox = ({ answer }) => {
  return (
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center gap-2 mb-3 text-blue-800 font-semibold">
        <Sparkles className="w-5 h-5" />
        <h3>AI Answer</h3>
      </div>
      <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
        {answer}
      </div>
    </div>
  );
};

export default AnswerBox;
