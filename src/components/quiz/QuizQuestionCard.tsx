import React from 'react';
import { motion } from 'framer-motion';
import { QuizQuestion } from '../../types';
import { Code2, Palette, TrendingUp, FlaskConical, Cpu, HeartHandshake, Briefcase, Sparkles, Terminal, Rocket, Microscope, Award } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedAnswer: any;
  onSelectAnswer: (answer: any) => void;
  className?: string;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  className
}) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Terminal':
        return <Terminal className="w-6 h-6" />;
      case 'Rocket':
        return <Rocket className="w-6 h-6" />;
      case 'Microscope':
        return <Microscope className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6', className)}
    >
      {/* Question Header */}
      <div>
        {question.subtitle && (
          <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-600 font-bold block mb-2">
            {question.subtitle}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-extrabold font-editorial text-slate-900 leading-tight">
          {question.text}
        </h2>
      </div>

      {/* 1. Visual Card Grid */}
      {question.type === 'visual' && question.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelectAnswer(option.id)}
                className={cn(
                  'p-6 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group relative overflow-hidden',
                  isSelected
                    ? 'bg-indigo-50/90 border-2 border-indigo-600 text-indigo-950 shadow-md scale-[1.01]'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-indigo-400 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center border transition-colors',
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100'
                    )}
                  >
                    {getIcon(option.icon)}
                  </div>
                  <div
                    className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center text-[10px]',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white font-bold'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && '✓'}
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold font-editorial text-slate-900 mb-1">
                    {option.label}
                  </h4>
                  {option.description && (
                    <p
                      className={cn(
                        'text-xs leading-relaxed',
                        isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600'
                      )}
                    >
                      {option.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Standard Choice List */}
      {question.type === 'choice' && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <button
                key={option.id}
                onClick={() => onSelectAnswer(option.id)}
                className={cn(
                  'w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start justify-between gap-4',
                  isSelected
                    ? 'bg-indigo-50/90 border-2 border-indigo-600 text-indigo-950 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-indigo-400 hover:bg-slate-50'
                )}
              >
                <div className="space-y-0.5">
                  <h5 className="text-sm font-bold text-slate-900">{option.label}</h5>
                  {option.description && (
                    <p className={cn('text-xs', isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600')}>
                      {option.description}
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-md border flex items-center justify-center text-[10px] shrink-0 mt-0.5',
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white font-bold'
                      : 'border-slate-300 bg-white'
                  )}
                >
                  {isSelected && '✓'}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Likert 5-Point Scale */}
      {question.type === 'likert' && (
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono font-bold">
            <span>{question.minLabel || 'Disagree'}</span>
            <span>{question.maxLabel || 'Agree'}</span>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((val) => {
              const isSelected = selectedAnswer === val;
              return (
                <button
                  key={val}
                  onClick={() => onSelectAnswer(val)}
                  className={cn(
                    'h-16 sm:h-20 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer font-mono font-bold text-base sm:text-lg',
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50'
                  )}
                >
                  <span>{val}</span>
                  <span className="text-[10px] uppercase font-sans font-normal opacity-80">
                    {val === 1
                      ? 'Low'
                      : val === 3
                      ? 'Neutral'
                      : val === 5
                      ? 'High'
                      : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Continuous Slider Input */}
      {question.type === 'slider' && (
        <div className="space-y-6 py-6 bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono uppercase font-bold">Your Stance</span>
            <span className="text-lg font-bold font-mono text-indigo-600">
              {selectedAnswer !== undefined ? `${selectedAnswer}%` : '50%'}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={selectedAnswer !== undefined ? selectedAnswer : 50}
            onChange={(e) => onSelectAnswer(Number(e.target.value))}
            className="w-full accent-indigo-600 bg-slate-200 h-2.5 rounded-lg appearance-none cursor-pointer"
          />

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1">
            <span className="max-w-[40%] text-left">{question.minLabel}</span>
            <span className="max-w-[40%] text-right">{question.maxLabel}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
