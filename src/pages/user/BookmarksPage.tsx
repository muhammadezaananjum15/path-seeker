import React, { useState, useEffect } from 'react';
import { Bookmark, Download, Trash2, FileText, ArrowRight } from 'lucide-react';
import { bookmarkApi } from '../../services/bookmarkApi';
import { Link } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = () => {
    setLoading(true);
    bookmarkApi
      .getBookmarks()
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.bookmarks)) {
          setBookmarks(res.data.bookmarks);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      await bookmarkApi.removeBookmark(id);
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (e) {}
  };

  const handleExportPDF = async () => {
    try {
      const res = await bookmarkApi.exportBookmarksPDF();
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PathSeeker-CareerPassport.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Generating PDF...');
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-purple-100 text-[#4F20C9] text-xs font-bold uppercase tracking-wider">
              SAVED PASSPORT
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#07031A]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Your Bookmarks & <span className="text-[#4F20C9]">Notes</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">Access your saved careers, videos, and study notes.</p>
          </div>

          <button
            onClick={handleExportPDF}
            className="px-6 py-3 rounded-full bg-[#4F20C9] hover:bg-purple-700 text-white font-bold text-xs shadow-md uppercase tracking-wider flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Passport PDF</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <Bookmark className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-bold text-[#07031A]">No bookmarks saved yet.</p>
            <Link to="/careers" className="inline-block px-5 py-2.5 rounded-full bg-[#4F20C9] text-white text-xs font-bold shadow-md">
              Explore Careers Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map((item) => (
              <div
                key={item._id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-[#4F20C9] text-[10px] font-bold uppercase">
                      {item.itemType} • {item.category}
                    </span>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-[#07031A]">{item.title}</h3>
                  {item.note && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold">Note:</span> {item.note}
                    </p>
                  )}
                </div>

                {item.itemType === 'career' && (
                  <Link
                    to={`/careers/${item.itemId}`}
                    className="text-xs font-bold text-[#4F20C9] flex items-center gap-1 hover:underline pt-2 border-t border-slate-100"
                  >
                    <span>View Career Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
