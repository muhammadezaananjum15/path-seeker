import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, BookOpen, User, Briefcase } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/useAuthStore';

export const OnboardingWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [institution, setInstitution] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [skills, setSkills] = useState('JavaScript, React, Communication');
  const [interests, setInterests] = useState('Technology, Data Science, Design');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await authApi.updateProfile({
        educationLevel,
        institution,
        fieldOfStudyOrDomain: fieldOfStudy,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: interests.split(',').map((i) => i.trim()).filter(Boolean),
      });
      navigate('/dashboard');
    } catch (e) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-[85vh] flex items-center justify-center px-4 py-12 text-slate-900">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl space-y-8 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
            STEP {step} OF 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Welcome to PathSeeker, {user?.name || 'Explorer'}!
          </h2>
          <p className="text-xs text-slate-500">Let's setup your Career Passport profile for personalized recommendations.</p>
        </div>

        {/* Step Indicator Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '33%' }}
            animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            className="bg-[#4F20C9] h-full"
          />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-bold text-sm text-[#07031A] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4F20C9]" />
                Education Background
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900"
                >
                  <option value="High School Senior">High School Senior</option>
                  <option value="Undergraduate">Undergraduate Student</option>
                  <option value="Recent Graduate">Recent University Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">University / College / School Name</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Aptech Computer Education"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Field of Study / Major</label>
                <input
                  type="text"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Computer Science, Digital Marketing, Mechanical Eng."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="font-bold text-sm text-[#07031A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4F20C9]" />
                Skills & Core Competencies
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Key Skills (Comma separated)</label>
                <textarea
                  rows={3}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="JavaScript, Python, Problem Solving, Figma, Data Analysis"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Career Interests & Domains</label>
                <textarea
                  rows={3}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Technology, Artificial Intelligence, Product Design, Finance"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-[#4F20C9] mx-auto" />
              <h3 className="text-xl font-bold text-[#07031A]">Your Passport is Ready!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We've configured your personalized recommendations based on your {educationLevel} profile and skills.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-7 py-3 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center gap-2"
            >
              <span>{loading ? 'Entering Dashboard...' : 'Enter Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
