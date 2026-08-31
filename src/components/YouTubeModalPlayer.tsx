import React from 'react';
import { X, Youtube, ExternalLink } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils/mediaHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  trackTitle?: string;
  artist?: string;
}

export const YouTubeModalPlayer: React.FC<Props> = ({
  isOpen,
  onClose,
  videoUrl,
  trackTitle,
  artist,
}) => {
  if (!isOpen || !videoUrl) return null;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-red-500/40 shadow-2xl shadow-black/95 p-4 sm:p-6 text-white my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif-heading text-base sm:text-lg font-bold text-white truncate">
                {trackTitle || 'Pemutar Video YouTube'}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {artist || 'Delfea Arrangement Music Official Release'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 transition-colors flex items-center gap-1.5 text-xs"
              title="Buka di YouTube Langsung"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Buka di YouTube</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
              aria-label="Tutup Pemutar Video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-inner">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={trackTitle || 'YouTube video player'}
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400 space-y-3">
              <Youtube className="w-12 h-12 text-red-500 opacity-60" />
              <div>
                <div className="text-sm font-semibold text-white">Format URL YouTube Tidak Didukung</div>
                <div className="text-xs text-gray-400 mt-1">
                  URL yang dimasukkan: {videoUrl}
                </div>
              </div>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Buka Link di Tab Baru
              </a>
            </div>
          )}
        </div>

        {/* Bottom Note */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
          <span>Official Audio / Music Video Streaming</span>
          <span className="text-gray-500">Delfea Studio Video Showcase</span>
        </div>
      </div>
    </div>
  );
};
