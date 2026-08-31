import React from 'react';
import { Play, Pause, Volume2, Sparkles, ArrowDown, ChevronRight, Music, AudioWaveform, Sliders, ShieldCheck, Flame } from 'lucide-react';
import { AudioCanvasHero } from './AudioCanvasHero';
import { WaveformVisualizer } from './WaveformVisualizer';
import { GenreId } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface Props {
  activeGenre: GenreId | null;
  isPlaying: boolean;
  onTogglePlay: (genre: GenreId) => void;
  onOpenConsultation: () => void;
}

export const HeroSection: React.FC<Props> = ({
  activeGenre,
  isPlaying,
  onTogglePlay,
  onOpenConsultation,
}) => {
  const { settings } = useSiteSettings();
  const { hero, genreShowcase } = settings;
  const genres = genreShowcase.genres;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const getTrustIcon = (iconName: string, index: number) => {
    switch (iconName?.toLowerCase()) {
      case 'sliders':
        return <Sliders className="w-5 h-5 text-[#FFC857] shrink-0" />;
      case 'flame':
        return <Flame className="w-5 h-5 text-[#A55EEA] shrink-0" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-5 h-5 text-[#FFC857] shrink-0" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-[#A55EEA] shrink-0" />;
      default:
        return index % 2 === 0 ? (
          <Sliders className="w-5 h-5 text-[#FFC857] shrink-0" />
        ) : (
          <Sparkles className="w-5 h-5 text-[#A55EEA] shrink-0" />
        );
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-24"
    >
      {/* Dynamic 3D/WebGL Canvas Background with abstract audio frequency waves */}
      <AudioCanvasHero intensity={1.2} />

      {/* Atmospheric Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#A55EEA]/12 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#FFC857]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-white/10 shadow-lg text-xs sm:text-sm text-[#FFC857] mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Sparkles className="w-4 h-4 text-[#FFC857]" />
          <span className="font-medium tracking-wide">
            {hero.badgeText || 'Studio Aransemen Musik & Produksi Audio Multi-Genre'}
          </span>
          {hero.badgeSubtext && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#A55EEA]" />
              <span className="text-gray-400 font-light hidden sm:inline">{hero.badgeSubtext}</span>
            </>
          )}
        </div>

        {/* Main Headline */}
        <h1
          id="hero-headline"
          className="font-serif-heading font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-[64px] text-white tracking-tight leading-[1.12] mb-6 max-w-4xl text-glow-gold"
        >
          {hero.headlinePart1}{' '}
          <span className="bg-gradient-to-r from-[#FFC857] via-[#FFAA00] to-[#A55EEA] bg-clip-text text-transparent">
            {hero.headlinePart2Highlight}
          </span>
        </h1>

        {/* Sub-Headline */}
        <p
          id="hero-subheadline"
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-10 font-normal"
        >
          {hero.subheadline}
        </p>

        {/* Quick Navigation & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-14 flex-wrap">
          {/* Karya Kami Button */}
          <button
            type="button"
            id="hero-karya-kami-btn"
            onClick={() => scrollToSection('karya-kami')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC857]/20 to-[#A55EEA]/20 border border-[#FFC857]/60 text-[#FFC857] hover:text-white hover:border-[#FFC857] font-bold text-sm sm:text-base hover:bg-[#FFC857]/20 shadow-lg shadow-[#FFC857]/15 transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <Music className="w-5 h-5 text-[#FFC857] transition-transform duration-300 group-hover:scale-110" />
            <span>{hero.btnCatalogText || 'Karya Musik Kami'}</span>
            <ChevronRight className="w-4 h-4 text-[#FFC857] group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Sample Audio Genre Showcase Button */}
          <button
            type="button"
            id="hero-listen-sample-btn"
            onClick={() => scrollToSection('showcase-genre')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-card border border-white/15 text-white font-semibold text-sm sm:text-base hover:bg-white/10 hover:border-[#FFC857]/50 hover:text-[#FFC857] shadow-lg transition-all duration-300 flex items-center justify-center gap-2.5 group"
          >
            <span>{hero.btnGenreText || 'Pameran Genre'}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Consultation Glow Accent CTA */}
          <button
            type="button"
            id="hero-consult-btn"
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-[#FFC857]/30 hover:shadow-[#FFC857]/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 glow-gold"
          >
            <Sparkles className="w-5 h-5 text-[#0D0E12]" />
            <span>{hero.btnConsultText || 'Konsultasi Proyek'}</span>
          </button>
        </div>

        {/* Interactive Quick Audition Mini Dock */}
        <div className="w-full max-w-3xl glass-card rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-[#181A24] border border-white/10 flex items-center justify-center shrink-0">
                <AudioWaveform className={`w-5 h-5 ${isPlaying ? 'text-[#FFC857] animate-pulse' : 'text-gray-400'}`} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Audisi Cepat Harmoni
                </div>
                <div className="text-sm font-semibold text-white">
                  {activeGenre
                    ? genres.find((g) => g.id === activeGenre)?.sampleTrackTitle
                    : 'Pilih Genre untuk Mendengarkan Karakter Aransemen'}
                </div>
              </div>
            </div>

            {/* Visualizer and genre quick tags */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <WaveformVisualizer
                isPlaying={isPlaying}
                accentColor={activeGenre === 'dangdut' || activeGenre === 'bossanova' || activeGenre === 'fusion' ? 'purple' : 'gold'}
                barCount={20}
                height={26}
                className="w-28 sm:w-36 mr-2"
              />
              
              {/* Quick sample trigger */}
              <button
                type="button"
                onClick={() => onTogglePlay(activeGenre || 'jazz')}
                className="px-4 py-2 rounded-lg bg-[#FFC857] text-[#0D0E12] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#FFAA00] transition-colors shrink-0 shadow-md shadow-[#FFC857]/20"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{activeGenre ? 'Lanjut Putar' : 'Putar Sampel Jazz'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Genre Pills */}
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
            <span className="text-[11px] text-gray-400 font-medium mr-1 hidden sm:inline">Pilihan Cepat:</span>
            {genres.map((g) => {
              const isCurrent = activeGenre === g.id && isPlaying;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onTogglePlay(g.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200 flex items-center gap-1 ${
                    isCurrent
                      ? 'bg-[#FFC857] text-[#0D0E12] font-semibold shadow-sm shadow-[#FFC857]/40'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {isCurrent ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current" />}
                  <span>{g.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 w-full max-w-4xl text-left">
          {hero.trustBadges.map((badge, idx) => (
            <div key={badge.id || idx} className="glass-card rounded-xl p-3.5 border border-white/5 flex items-center gap-3">
              {getTrustIcon(badge.icon, idx)}
              <div>
                <div className="text-xs font-semibold text-white">{badge.title}</div>
                <div className="text-[11px] text-gray-400">{badge.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <button
          type="button"
          onClick={() => scrollToSection('showcase-genre')}
          className="mt-14 inline-flex flex-col items-center gap-1.5 text-gray-400 hover:text-[#FFC857] transition-colors group focus:outline-none"
        >
          <span className="text-xs tracking-widest uppercase font-medium">Jelajahi Showcase</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#FFC857]" />
        </button>
      </div>
    </section>
  );
};
