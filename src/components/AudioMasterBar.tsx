import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, Music, Sparkles, X, Sliders } from 'lucide-react';
import { globalAudioEngine } from '../audio/audioEngine';
import { GenreId } from '../types';
import { GENRE_DATA } from '../data/mockData';
import { WaveformVisualizer } from './WaveformVisualizer';

interface Props {
  activeGenre: GenreId | null;
  isPlaying: boolean;
  onTogglePlay: (genre: GenreId) => void;
  onOpenConsultation: () => void;
}

export const AudioMasterBar: React.FC<Props> = ({
  activeGenre,
  isPlaying,
  onTogglePlay,
  onOpenConsultation,
}) => {
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const currentTrack = GENRE_DATA.find((g) => g.id === activeGenre) || GENRE_DATA[0];

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalAudioEngine.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const muted = globalAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleNextTrack = () => {
    const currentIndex = GENRE_DATA.findIndex((g) => g.id === activeGenre);
    const nextIndex = (currentIndex + 1) % GENRE_DATA.length;
    onTogglePlay(GENRE_DATA[nextIndex].id);
  };

  if (!isVisible && !isPlaying) return null;

  return (
    <div
      id="master-audio-dock"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-6 lg:left-auto lg:right-6 lg:max-w-xl z-40 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-[#FFC857]/30 shadow-2xl shadow-black/90 flex items-center justify-between gap-3 relative overflow-hidden backdrop-blur-2xl">
        {/* Subtle accent glow line on top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FFC857] via-[#A55EEA] to-[#FFC857]" />

        {/* Left: Play/Pause button and Track info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onTogglePlay(currentTrack.id)}
            className="w-10 h-10 rounded-xl bg-[#FFC857] text-[#0D0E12] flex items-center justify-center shrink-0 shadow-md shadow-[#FFC857]/30 hover:scale-105 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30">
                {currentTrack.name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {currentTrack.bpm} BPM
              </span>
            </div>
            <div className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-[220px]">
              {currentTrack.sampleTrackTitle}
            </div>
          </div>
        </div>

        {/* Middle: Live mini visualizer */}
        <div className="hidden sm:block w-24 shrink-0">
          <WaveformVisualizer
            isPlaying={isPlaying}
            accentColor={currentTrack.accentColor}
            barCount={16}
            height={20}
          />
        </div>

        {/* Right: Controls & CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Next button */}
          <button
            type="button"
            onClick={handleNextTrack}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Genre Selanjutnya"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Volume control */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleMute}
              className="text-gray-400 hover:text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#FFC857]" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFC857]"
            />
          </div>

          {/* Direct Order Quick Button */}
          <button
            type="button"
            onClick={onOpenConsultation}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#FFC857] hover:text-[#0D0E12] text-white text-[11px] font-semibold transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Pesan Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
