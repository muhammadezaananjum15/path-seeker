import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center text-center p-8 space-y-6 text-slate-900">
      <div className="w-20 h-20 rounded-3xl bg-purple-100 text-[#4F20C9] flex items-center justify-center">
        <Target className="w-10 h-10" />
      </div>
      <h1 className="text-5xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>404 - Route Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md">
        The career path or page you are looking for doesn't exist or has moved to a new destination.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home Page
      </Link>
    </div>
  );
};
