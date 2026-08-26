import React, { useState, useEffect } from 'react';
import { User, FileText, Upload, Check, Save } from 'lucide-react';
import { authApi } from '../../services/authApi';
import { useAuthStore } from '../../stores/useAuthStore';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [skills, setSkills] = useState('React, JavaScript, Python');
  const [interests, setInterests] = useState('Web Development, AI');
  const [bio, setBio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    authApi.getProfile().then((res) => {
      if (res.data.success && res.data.profile) {
        const p = res.data.profile;
        setEducationLevel(p.educationLevel || 'Undergraduate');
        setSkills(p.skills ? p.skills.join(', ') : '');
        setInterests(p.interests ? p.interests.join(', ') : '');
        setBio(p.bio || '');
        setResumeUrl(p.resumeUrl || '');
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const skillsArr = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const interestsArr = interests.split(',').map((i) => i.trim()).filter(Boolean);

      const res = await authApi.updateProfile({
        name,
        educationLevel,
        skills: skillsArr,
        interests: interestsArr,
        bio,
      });

      if (res.data.success) {
        setUser({ ...user!, name });
        setMsg('Profile updated successfully!');
      }
    } catch (e) {} finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('resume', e.target.files[0]);

    try {
      const res = await authApi.uploadResume(formData);
      if (res.data.success) {
        setResumeUrl(res.data.resumeUrl);
        alert('Resume uploaded successfully!');
      }
    } catch (err: any) {
      alert('Resume upload failed.');
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>My Passport Profile</h1>
          <p className="text-xs text-slate-500">Manage your education, skills, resume PDF, and account credentials.</p>
        </div>

        {msg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-600">
            {msg}
          </div>
        )}

        <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
              <input
                type="text"
                disabled
                value={user?.role?.toUpperCase()}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 text-sm text-slate-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-semibold"
              >
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate Senior</option>
                <option value="Bachelor Degree">Bachelor of Science / Technology</option>
                <option value="Master Degree">Master Degree / PhD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Skills (Comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Python, SQL"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Career Interests (Comma separated)</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Web Development, Data Science, Product Management"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Career Goal Statement</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your career goals..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900"
            />
          </div>

          {/* Resume PDF Upload */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#4F20C9]" />
              <div>
                <p className="text-xs font-bold text-slate-900">Resume Document (PDF/DOCX)</p>
                <p className="text-[11px] text-slate-400">{resumeUrl ? resumeUrl : 'No resume uploaded yet.'}</p>
              </div>
            </div>

            <label className="px-4 py-2 rounded-xl bg-[#4F20C9] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-purple-700">
              <Upload className="w-4 h-4" />
              <span>Upload Resume</span>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
