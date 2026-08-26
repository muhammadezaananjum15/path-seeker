import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { quizApi } from '../../services/quizApi';

export const AdminQuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('Interests');

  const fetchQuestions = () => {
    setLoading(true);
    quizApi.getQuestions().then((res) => {
      if (res.data.success) setQuestions(res.data.questions);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await quizApi.createQuestion({
        questionText,
        category,
        type: 'mcq',
        options: [
          { label: 'High Interest', value: 'high_interest', scoreMap: { technology: 5 } },
          { label: 'Moderate Interest', value: 'mod_interest', scoreMap: { business: 3 } },
        ],
      });
      setQuestionText('');
      fetchQuestions();
    } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete question?')) {
      await quizApi.deleteQuestion(id);
      fetchQuestions();
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <h2 className="text-xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Manage Quiz Questions ({questions.length})</h2>

      <form onSubmit={handleAdd} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-[#07031A]">Add New Quiz Question</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" required value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Question Text" className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900">
            <option value="Interests">Interests</option>
            <option value="Skills">Skills</option>
            <option value="Work Style">Work Style</option>
            <option value="Values">Values</option>
            <option value="Preferences">Preferences</option>
          </select>
        </div>
        <button type="submit" className="px-6 py-2.5 rounded-full bg-[#4F20C9] text-white font-bold text-xs uppercase tracking-wider">Save Question</button>
      </form>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q._id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-[#4F20C9] text-[10px] font-bold uppercase">{q.category}</span>
              <p className="font-bold text-xs text-[#07031A] mt-1">{q.questionText}</p>
            </div>
            <button onClick={() => handleDelete(q._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
