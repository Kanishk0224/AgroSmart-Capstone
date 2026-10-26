import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
        <Leaf className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-1">Agricultural Field Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-2">
        The page you are looking for has been relocated or does not exist.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
