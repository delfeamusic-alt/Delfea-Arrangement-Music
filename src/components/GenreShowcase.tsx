import React, { useState } from 'react';
import { Play, Pause, Volume2, Sparkles, Disc, Sliders, Music, Radio, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { GenreCardData, GenreId } from '../types';
import { WaveformVisualizer } from './WaveformVisualizer';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface Props {
  activeGenre: GenreId | null;
  isPlaying: boolean;
  onTogglePlay: (genre: GenreId) => void;
  onSelectForOrder: (genre: GenreId) => void;
}

export const GenreShowcase: React.FC<Props> = ({
  activeGenre,
  isPlaying,
  onTogglePlay,
  onSelectForOrder,
}) => {
  const { settings } = useSiteSettings();
  const { genreShowcase, branding } = settings;
  const genres = genreShowcase.genres;

  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);

  const renderGenreVisualIcon = (genre: GenreCardData, isCardPlaying: boolean) => {
    switch (genre.id) {
      case 'jazz':
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC857]/20 to-[#FFC857]/5 border border-[#FFC857]/30 flex items-center justify-center overflow-hidden group-hover:border-[#FFC857] transition-all">
            <svg
              className={`w-9 h-9 text-[#FFC857] transition-transform duration-300 ${isCardPlaying ? 'scale-110 rotate-3' : 'group-hover:scale-105'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Saxophone stylization */}
              <path d="M6 3v7a6 6 0 0 0 6 6h1a4 4 0 0 0 4-4v-1a2 2 0 0 0-2-2h-3" />
              <circle cx="16" cy="16" r="3" fill={isCardPlaying ? '#FFC857' : 'none'} fillOpacity="0.3" />
              <path d="M6 3h2" />
              <path d="M9 7h1" />
              <path d="M9 10h1" />
              <path d="M10 13h1" />
            </svg>
            {isCardPlaying && (
              <div className="absolute inset-0 bg-[#FFC857]/15 rounded-2xl animate-pulse" />
            )}
          </div>
        );

      case 'bossanova':
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A55EEA]/20 to-[#A55EEA]/5 border border-[#A55EEA]/30 flex items-center justify-center overflow-hidden group-hover:border-[#A55EEA] transition-all">
            <svg
              className={`w-9 h-9 text-[#C084FC] transition-transform duration-300 ${isCardPlaying ? 'scale-110 -rotate-3' : 'group-hover:scale-105'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Nylon Guitar & warm waves */}
              <path d="m19 5-3 3" />
              <path d="m2 22 8-8" />
              <circle cx="14" cy="10" r="5" fill={isCardPlaying ? '#A55EEA' : 'none'} fillOpacity="0.25" />
              <circle cx="14" cy="10" r="1.5" />
              <path d="M9 15c-2.5 0-4.5 1.5-4.5 3.5S6.5 22 9 22s4.5-1.5 4.5-3.5" />
            </svg>
            {isCardPlaying && (
              <div className="absolute inset-0 bg-[#A55EEA]/15 rounded-2xl animate-pulse" />
            )}
          </div>
        );

      case 'pop':
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC857]/20 to-[#FFC857]/5 border border-[#FFC857]/30 flex items-center justify-center overflow-hidden group-hover:border-[#FFC857] transition-all">
            <svg
              className={`w-9 h-9 text-[#FFC857] transition-transform duration-300 ${isCardPlaying ? 'scale-110' : 'group-hover:scale-105'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Radio spectrum & mic */}
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill={isCardPlaying ? '#FFC857' : 'none'} fillOpacity="0.2" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
            {isCardPlaying && (
              <div className="absolute inset-0 bg-[#FFC857]/15 rounded-2xl animate-pulse" />
            )}
          </div>
        );

      case 'dangdut':
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A55EEA]/20 to-[#A55EEA]/5 border border-[#A55EEA]/30 flex items-center justify-center overflow-hidden group-hover:border-[#A55EEA] transition-all">
            <svg
              className={`w-9 h-9 text-[#C084FC] transition-transform duration-300 ${isCardPlaying ? 'scale-110 rotate-6' : 'group-hover:scale-105'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Futuristic Kendang Drums */}
              <ellipse cx="8" cy="9" rx="5" ry="3" fill={isCardPlaying ? '#A55EEA' : 'none'} fillOpacity="0.3" />
              <ellipse cx="16" cy="14" rx="5.5" ry="3.5" fill={isCardPlaying ? '#FFC857' : 'none'} fillOpacity="0.2" />
              <path d="M3 9v6c0 1.66 2.24 3 5 3s5-1.34 5-3V9" />
              <path d="M10.5 14v5c0 1.93 2.46 3.5 5.5 3.5s5.5-1.57 5.5-3.5v-5" />
            </svg>
            {isCardPlaying && (
              <div className="absolute inset-0 bg-[#A55EEA]/15 rounded-2xl animate-pulse" />
            )}
          </div>
        );

      case 'gamelan':
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFC857]/20 to-[#FFC857]/5 border border-[#FFC857]/30 flex items-center justify-center overflow-hidden group-hover:border-[#FFC857] transition-all">
            <svg
              className={`w-9 h-9 text-[#FFC857] transition-transform duration-300 ${isCardPlaying ? 'scale-110' : 'group-hover:scale-105'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Bonang / Gong ornament */}
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" fill={isCardPlaying ? '#FFC857' : 'none'} fillOpacity="0.3" />
              <circle cx="12" cy="12" r="2" fill="#FFC857" />
              <path d="M12 3v4" />
              <path d="M12 17v4" />
              <path d="M3 12h4" />
              <path d="M17 12h4" />
            </svg>
            {isCardPlaying && (
              <div className="absolute inset-0 bg-[#FFC857]/15 rounded-2xl animate-pulse" />
            )}
          </div>
        );

      case 'fusion':
      default:
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A55EEA]/20 to-[#A55EEA]/5 border border-[#A55EEA]/30 flex items-center justify-center overflow-hidden group-hover:border-[#A55EEA] transition-all">
            <svg
              className={`w-9 h-9 text-[#C084FC] transition-transform duration-300 ${isCardPlaying ? 'scale-110 rotate-12' : 'group-hover:scale-105'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Multi-instrument cross fusion atom */}
              <circle cx="12" cy="12" r="3" fill="#A55EEA" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" />
              <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
            </svg>
            {isCardPlaying && (
              <div className="absolute inset-0 bg-[#A55EEA]/15 rounded-2xl animate-pulse" />
            )}
          </div>
        );
    }
  };

  return (
    <section
      id="showcase-genre"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181A24] border border-[#FFC857]/30 text-xs font-semibold text-[#FFC857] mb-3">
          <Disc className="w-3.5 h-3.5" />
          <span>{genreShowcase.badge || 'Interactive Genre Showcase'}</span>
        </div>
        <h2 className="font-serif-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-4 text-glow-gold">
          {genreShowcase.title || 'Pameran Genre Interaktif'}
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          {genreShowcase.description}
        </p>
      </div>

      {/* 3x2 Interactive Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {genres.map((genre) => {
          const isCardPlaying = activeGenre === genre.id && isPlaying;
          const isHovered = hoveredGenre === genre.id;

          const isGold = genre.accentColor === 'gold';
          const borderColorClass = isCardPlaying
            ? isGold
              ? 'border-[#FFC857] shadow-xl shadow-[#FFC857]/20 bg-[#161824]'
              : 'border-[#A55EEA] shadow-xl shadow-[#A55EEA]/20 bg-[#161824]'
            : isHovered
            ? isGold
              ? 'border-[#FFC857]/60 shadow-lg shadow-[#FFC857]/10'
              : 'border-[#A55EEA]/60 shadow-lg shadow-[#A55EEA]/10'
            : 'border-white/10';

          return (
            <div
              key={genre.id}
              id={`genre-card-${genre.id}`}
              onMouseEnter={() => setHoveredGenre(genre.id)}
              onMouseLeave={() => setHoveredGenre(null)}
              className={`glass-card rounded-2xl p-6 transition-all duration-300 relative group flex flex-col justify-between overflow-hidden ${borderColorClass}`}
            >
              {/* Ambient neon corner glow */}
              <div
                className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
                  isGold ? 'bg-[#FFC857]/10' : 'bg-[#A55EEA]/10'
                } ${isCardPlaying || isHovered ? 'opacity-100' : 'opacity-30'}`}
              />

              {/* Card Top: Icon & Genre Details */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-5">
                  {renderGenreVisualIcon(genre, isCardPlaying)}

                  <div className="text-right">
                    <span
                      className={`inline-block text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isGold
                          ? 'bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/30'
                          : 'bg-[#A55EEA]/10 text-[#C084FC] border-[#A55EEA]/30'
                      }`}
                    >
                      {genre.highlightTag}
                    </span>
                    <div className="text-[11px] text-gray-400 font-mono mt-1">
                      {genre.bpm} BPM • {genre.musicalKey}
                    </div>
                  </div>
                </div>

                {/* Genre Title */}
                <h3 className="font-serif-heading font-bold text-2xl text-white mb-1 group-hover:text-[#FFC857] transition-colors">
                  {genre.name}
                </h3>
                <div className="text-xs text-gray-400 font-medium mb-3">
                  {genre.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  {genre.description}
                </p>

                {/* Instrumentation Tags */}
                <div className="mb-5">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3 h-3 text-[#FFC857]" />
                    <span>Karakter Instrumen Utama</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {genre.instrumentation?.map((inst, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Bottom: Embedded Custom Audio Player */}
              <div className="pt-4 border-t border-white/10 mt-auto">
                <div className="bg-[#0D0E12]/80 rounded-xl p-3.5 border border-white/5">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    {/* Play/Pause Button */}
                    <button
                      type="button"
                      id={`play-btn-${genre.id}`}
                      onClick={() => onTogglePlay(genre.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 shadow-md ${
                        isCardPlaying
                          ? isGold
                            ? 'bg-[#FFC857] text-[#0D0E12] shadow-[#FFC857]/40 scale-105'
                            : 'bg-[#A55EEA] text-white shadow-[#A55EEA]/40 scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                      }`}
                      aria-label={isCardPlaying ? 'Jeda sampel audio' : 'Putar sampel audio'}
                    >
                      {isCardPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                        <span>{genre.sampleTrackTitle}</span>
                        {isCardPlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC857] animate-ping shrink-0" />
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">
                        {genre.sampleTrackSubtitle}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Waveform Visualizer */}
                  <WaveformVisualizer
                    isPlaying={isCardPlaying}
                    accentColor={isGold ? 'gold' : 'purple'}
                    barCount={30}
                    height={28}
                    className="w-full"
                  />
                </div>

                {/* Direct Request Action */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Ingin aransemen gaya ini?
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectForOrder(genre.id)}
                    className="text-xs font-semibold text-[#FFC857] hover:text-white flex items-center gap-1 group/btn transition-colors"
                  >
                    <span>Pilih Genre Ini</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Jump to Diskografi Karya Kami */}
      <div className="mt-14 p-5 rounded-2xl glass-card border border-[#FFC857]/30 bg-gradient-to-r from-[#FFC857]/10 via-[#181A24] to-[#A55EEA]/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-[#FFC857]/20 border border-[#FFC857]/40 flex items-center justify-center shrink-0">
            <Music className="w-5 h-5 text-[#FFC857]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Ingin Menikmati Karya Musik Produksi {branding.brandName || 'Delfea'} Studio Lengkap?
            </div>
            <div className="text-xs text-gray-300">
              Lihat koleksi diskografi, video YouTube, audio master, dan rincian aransemen kami.
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('karya-kami');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '#karya-kami');
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-[#FFC857] hover:bg-[#FFAA00] text-[#0D0E12] font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#FFC857]/25 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
        >
          <span>Lihat Karya Musik Kami</span>
          <span>↓</span>
        </button>
      </div>
    </section>
  );
};
