import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { multimediaApi } from '../../services/multimediaApi';
import { ArrowLeft, Star, FileText, CheckCircle2 } from 'lucide-react';

export const VideoDetailPage: React.FC = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const [media, setMedia] = useState<any>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    if (mediaId) {
      multimediaApi
        .getMediaById(mediaId)
        .then((res) => {
          if (res.data.success) {
            setMedia(res.data.media);
          }
        })
        .catch(() => {});
    }
  }, [mediaId]);

  const handleRate = async (ratingVal: number) => {
    if (!mediaId) return;
    try {
      const res = await multimediaApi.rateMedia(mediaId, ratingVal);
      if (res.data.success) {
        setMedia({ ...media, ratingAvg: res.data.ratingAvg, ratingCount: res.data.ratingCount });
        setRated(true);
      }
    } catch (e) {}
  };

  if (!media) {
    return <div className="max-w-7xl mx-auto py-20 text-center text-slate-500">Loading video...</div>;
  }

  return (
    <div className="bg-white min-h-screen py-8 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          to="/multimedia"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#4F20C9]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Multimedia Center
        </Link>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <div className="relative aspect-video rounded-3xl bg-slate-900 overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${media.youtubeVideoId}`}
              title={media.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-3 py-1 rounded-md bg-purple-50 text-[#4F20C9] text-xs font-bold uppercase">
                {media.category}
              </span>
              <h1 className="text-2xl font-black text-[#07031A] mt-2">{media.title}</h1>
            </div>

            {/* Rating Control */}
            <div className="space-y-1 text-right">
              <p className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {media.ratingAvg} / 5.0 ({media.ratingCount} reviews)
              </p>
              <div className="flex items-center gap-1 justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className="hover:scale-125 transition-transform"
                  >
                    <Star className="w-4 h-4 text-amber-400" />
                  </button>
                ))}
              </div>
              {rated && <p className="text-[10px] text-emerald-500 font-bold">Thank you for rating!</p>}
            </div>
          </div>

          {/* Video Transcript Section */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h3 className="font-bold text-sm text-[#07031A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4F20C9]" />
              Video Transcript & Key Highlights
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{media.transcript}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
