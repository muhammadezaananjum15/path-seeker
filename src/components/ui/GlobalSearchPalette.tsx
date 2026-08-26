import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, BookOpen, Video, Users, FileText, ArrowRight, X } from 'lucide-react';
import { useUIStore } from '../../stores/useUIStore';
import { useCareerStore } from '../../stores/useCareerStore';
import { useContentStore } from '../../stores/useContentStore';
import { useResourceStore } from '../../stores/useResourceStore';
import { useStoryStore } from '../../stores/useStoryStore';
import apiClient from '../../services/apiClient';

export const GlobalSearchPalette: React.FC = () => {
  const { isSearchModalOpen, setSearchModalOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const navigate = useNavigate();

  const { careers } = useCareerStore();
  const { mediaItems } = useContentStore();
  const { resources } = useResourceStore();
  const { stories } = useStoryStore();

  // Dynamic API Fetch Effect
  useEffect(() => {
    if (!query.trim()) {
      setApiResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setApiLoading(true);
      try {
        const res = await apiClient.get(`/search/google?query=${encodeURIComponent(query.trim())}`);
        if (res.data.success && Array.isArray(res.data.results)) {
          setApiResults(res.data.results.slice(0, 4));
        }
      } catch (e) {
      } finally {
        setApiLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedCareers = q
    ? careers
        .filter((c) => c.title.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q))
        .slice(0, 4)
    : careers.slice(0, 3);

  const matchedMedia = q
    ? mediaItems
        .filter((m) => m.title.toLowerCase().includes(q) || m.instructor.name.toLowerCase().includes(q))
        .slice(0, 3)
    : [];

  const matchedResources = q
    ? resources.filter((r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q))).slice(0, 3)
    : [];

  const matchedStories = q
    ? stories.filter((s) => s.title.toLowerCase().includes(q) || s.candidateName.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const handleSelect = (path: string) => {
    setSearchModalOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSearchModalOpen(false)}
          className="fixed inset-0 bg-[#030305]/85 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="relative w-full max-w-2xl bg-[#08012B] border border-[#6755C2]/40 rounded-2xl shadow-[0_25px_60px_rgba(3,3,5,0.9)] overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#6755C2]/20">
            <Search className="w-5 h-5 text-[#6755C2] mr-3 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search careers, skills, masterclasses, playbooks, or success stories..."
              className="w-full bg-transparent text-[#F4F2FA] placeholder-[#8B85A8] text-sm focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[#8B85A8] hover:text-[#F4F2FA] p-1 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[10px] bg-[#07031A] text-[#8B85A8] px-2 py-0.5 rounded border border-[#6755C2]/20 ml-2">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">

            {/* Live Web & Career Search Results (Google/Dev.to API) */}
            {apiResults.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6755C2] uppercase tracking-wider mb-2 px-2">
                  <Search className="w-3.5 h-3.5 text-[#6755C2]" />
                  <span>Live Web &amp; API Results ({apiResults.length})</span>
                </div>
                <div className="space-y-1">
                  {apiResults.map((item, idx) => (
                    <a
                      key={item.url || idx}
                      href={item.link || item.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setSearchModalOpen(false)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#07031A] border border-transparent hover:border-[#6755C2]/30 transition-all text-left group cursor-pointer block"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#F4F2FA] group-hover:text-[#6755C2] transition-colors line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#8B85A8] line-clamp-1">
                          {item.source || 'Search Result'} · {item.snippet || item.url}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8B85A8] group-hover:text-[#F4F2FA] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Careers Section */}
            {matchedCareers.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B85A8] uppercase tracking-wider mb-2 px-2">
                  <Compass className="w-3.5 h-3.5 text-[#6755C2]" />
                  <span>Careers</span>
                </div>
                <div className="space-y-1">
                  {matchedCareers.map((career) => (
                    <button
                      key={career.id}
                      onClick={() => handleSelect(`/careers/${career.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#07031A] border border-transparent hover:border-[#6755C2]/30 transition-all text-left group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#F4F2FA] group-hover:text-[#6755C2] transition-colors">
                          {career.title}
                        </p>
                        <p className="text-[11px] text-[#8B85A8]">
                          {career.domain} · Avg {career.averageSalary ? `$${(career.averageSalary / 1000).toFixed(0)}k/yr` : ''}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8B85A8] group-hover:text-[#F4F2FA] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multimedia Section */}
            {matchedMedia.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B85A8] uppercase tracking-wider mb-2 px-2">
                  <Video className="w-3.5 h-3.5 text-[#6755C2]" />
                  <span>Multimedia & Masterclasses</span>
                </div>
                <div className="space-y-1">
                  {matchedMedia.map((media) => (
                    <button
                      key={media.id}
                      onClick={() => handleSelect(`/multimedia/${media.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#07031A] border border-transparent hover:border-[#6755C2]/30 transition-all text-left group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#F4F2FA] group-hover:text-[#6755C2] transition-colors">
                          {media.title}
                        </p>
                        <p className="text-[11px] text-[#8B85A8]">
                          {media.instructor.name} · {media.durationMinutes} mins
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8B85A8] group-hover:text-[#F4F2FA] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Resources Section */}
            {matchedResources.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B85A8] uppercase tracking-wider mb-2 px-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#6755C2]" />
                  <span>Resources & Guides</span>
                </div>
                <div className="space-y-1">
                  {matchedResources.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleSelect('/resources')}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#07031A] border border-transparent hover:border-[#6755C2]/30 transition-all text-left group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#F4F2FA] group-hover:text-[#6755C2] transition-colors">
                          {res.title}
                        </p>
                        <p className="text-[11px] text-[#8B85A8]">
                          {res.type} · {res.fileFormat} ({res.fileSize})
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8B85A8] group-hover:text-[#F4F2FA] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stories Section */}
            {matchedStories.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8B85A8] uppercase tracking-wider mb-2 px-2">
                  <Users className="w-3.5 h-3.5 text-[#6755C2]" />
                  <span>Success Stories</span>
                </div>
                <div className="space-y-1">
                  {matchedStories.map((story) => (
                    <button
                      key={story.id}
                      onClick={() => handleSelect(`/success-stories/${story.id}`)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#07031A] border border-transparent hover:border-[#6755C2]/30 transition-all text-left group cursor-pointer"
                    >
                      <div>
                        <p className="text-xs font-medium text-[#F4F2FA] group-hover:text-[#6755C2] transition-colors">
                          {story.title}
                        </p>
                        <p className="text-[11px] text-[#8B85A8]">
                          {story.candidateName} · {story.roleFrom} → {story.roleTo}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8B85A8] group-hover:text-[#F4F2FA] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && matchedCareers.length === 0 && matchedMedia.length === 0 && matchedResources.length === 0 && (
              <div className="text-center py-8 text-[#8B85A8] text-xs">
                No matches found for &quot;{query}&quot;. Try searching for &quot;Design&quot;, &quot;AI&quot;, &quot;Security&quot;, or &quot;Product&quot;.
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-[#07031A] border-t border-[#6755C2]/20 flex items-center justify-between text-[11px] text-[#8B85A8]">
            <span>Press Enter to select, ESC to exit</span>
            <span>PathSeeker Fast Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
