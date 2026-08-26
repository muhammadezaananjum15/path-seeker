import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storyApi } from '../../services/storyApi';
import { ArrowLeft, Calendar, Award } from 'lucide-react';

export const StoryDetailPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    if (storyId) {
      storyApi.getStoryById(storyId).then((res) => {
        if (res.data.success) {
          setStory(res.data.story);
        }
      });
    }
  }, [storyId]);

  if (!story) return <div className="max-w-7xl mx-auto py-20 text-center text-slate-500">Loading story...</div>;

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link to="/stories" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#4F20C9]">
          <ArrowLeft className="w-4 h-4" />
          Back to Success Stories
        </Link>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-8">
          <div className="flex items-center gap-4">
            <img src={story.imageUrl} alt={story.authorName} className="w-16 h-16 rounded-full object-cover border-2 border-[#4F20C9]" />
            <div>
              <h1 className="text-2xl font-black text-[#07031A]">{story.authorName}</h1>
              <span className="px-3 py-1 rounded-md bg-purple-50 text-[#4F20C9] text-xs font-bold uppercase">
                {story.domain}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#07031A] leading-snug">{story.headline}</h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{story.storyText}</p>

          {/* Career Timeline Section */}
          {story.timeline && story.timeline.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-50 space-y-4 border border-slate-100">
              <h3 className="font-bold text-base text-[#07031A] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#4F20C9]" />
                Career Journey Timeline
              </h3>
              <div className="space-y-4 relative border-l-2 border-[#4F20C9] pl-4 ml-2">
                {story.timeline.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-xs font-black text-[#4F20C9]">{item.year}</span>
                    <h4 className="font-bold text-xs text-[#07031A]">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
