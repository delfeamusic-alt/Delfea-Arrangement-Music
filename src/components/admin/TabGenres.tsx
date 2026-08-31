import React, { useState } from 'react';
import { Disc, Music, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { GenreCardData } from '../../types';

export const TabGenres: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const genreSection = settings.genreShowcase;
  const [expandedGenreId, setExpandedGenreId] = useState<string | null>(genreSection.genres[0]?.id || null);

  const handleGenreFieldChange = (index: number, key: keyof GenreCardData, value: any) => {
    const updated = [...genreSection.genres];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    updateSection('genreShowcase', { genres: updated });
  };

  const handleInstrumentationChange = (index: number, rawText: string) => {
    const instruments = rawText.split(',').map((s) => s.trim()).filter(Boolean);
    handleGenreFieldChange(index, 'instrumentation', instruments);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Section Header Controls */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#FFC857]" />
          <span>Teks Header Bagian Pameran Genre</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Badge Label Bagian
            </label>
            <input
              type="text"
              value={genreSection.badge}
              onChange={(e) => updateSection('genreShowcase', { badge: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Judul Utama Bagian Genre
            </label>
            <input
              type="text"
              value={genreSection.title}
              onChange={(e) => updateSection('genreShowcase', { title: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Deskripsi Pengantar Bagian Genre
          </label>
          <textarea
            rows={2}
            value={genreSection.description}
            onChange={(e) => updateSection('genreShowcase', { description: e.target.value })}
            className="w-full bg-[#181A24] border border-white/15 rounded-xl p-3 text-sm text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>
      </div>

      {/* Individual Genre Cards Editor */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Music className="w-4 h-4 text-[#A55EEA]" />
          <span>Pengaturan Konten 6 Genre Interaktif</span>
        </h4>

        {genreSection.genres.map((genre, idx) => {
          const isExpanded = expandedGenreId === genre.id;
          return (
            <div
              key={genre.id}
              className="rounded-2xl bg-[#0D0E12] border border-white/10 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedGenreId(isExpanded ? null : genre.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#181A24] border border-white/10 flex items-center justify-center font-bold text-xs text-[#FFC857]">
                    0{idx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white mr-2">{genre.name}</span>
                    <span className="text-xs text-gray-400 font-light">({genre.subtitle})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10 hidden sm:inline">
                    {genre.highlightTag}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-5 border-t border-white/10 space-y-4 bg-[#141620]/60">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Nama Genre</label>
                      <input
                        type="text"
                        value={genre.name}
                        onChange={(e) => handleGenreFieldChange(idx, 'name', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Sub-Judul Genre</label>
                      <input
                        type="text"
                        value={genre.subtitle}
                        onChange={(e) => handleGenreFieldChange(idx, 'subtitle', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Tag Sorotan (Pill)</label>
                      <input
                        type="text"
                        value={genre.highlightTag}
                        onChange={(e) => handleGenreFieldChange(idx, 'highlightTag', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Deskripsi Genre</label>
                    <textarea
                      rows={2}
                      value={genre.description}
                      onChange={(e) => handleGenreFieldChange(idx, 'description', e.target.value)}
                      className="w-full bg-[#0D0E12] border border-white/15 rounded-lg p-3 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Judul Sampel Audio</label>
                      <input
                        type="text"
                        value={genre.sampleTrackTitle}
                        onChange={(e) => handleGenreFieldChange(idx, 'sampleTrackTitle', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Sub-Judul Sampel Audio</label>
                      <input
                        type="text"
                        value={genre.sampleTrackSubtitle}
                        onChange={(e) => handleGenreFieldChange(idx, 'sampleTrackSubtitle', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Tempo (BPM)</label>
                      <input
                        type="number"
                        value={genre.bpm}
                        onChange={(e) => handleGenreFieldChange(idx, 'bpm', parseInt(e.target.value) || 120)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Tangga Nada (Key)</label>
                      <input
                        type="text"
                        value={genre.musicalKey}
                        onChange={(e) => handleGenreFieldChange(idx, 'musicalKey', e.target.value)}
                        className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Karakter Instrumen Utama (Pisahkan dengan tanda koma)
                    </label>
                    <input
                      type="text"
                      value={genre.instrumentation?.join(', ') || ''}
                      onChange={(e) => handleInstrumentationChange(idx, e.target.value)}
                      placeholder="Contoh: Spanish Nylon Guitar, Concert Flute, Shaker, Acoustic Bass"
                      className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
