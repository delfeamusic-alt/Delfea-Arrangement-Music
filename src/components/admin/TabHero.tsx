import React from 'react';
import { Sparkles, Sliders, Flame, ShieldCheck, Music } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { TrustBadgeItem } from '../../types';

export const TabHero: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const hero = settings.hero;

  const handleBadgeChange = (index: number, key: keyof TrustBadgeItem, value: string) => {
    const updated = [...hero.trustBadges];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    updateSection('hero', { trustBadges: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header & Badges */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC857]" />
          <span>Teks Banner Utama (Hero Section)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Pill Badge Teks Atas
            </label>
            <input
              type="text"
              value={hero.badgeText}
              onChange={(e) => updateSection('hero', { badgeText: e.target.value })}
              placeholder="Contoh: Studio Aransemen Musik & Produksi Audio"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Sub-Badge Pill
            </label>
            <input
              type="text"
              value={hero.badgeSubtext}
              onChange={(e) => updateSection('hero', { badgeSubtext: e.target.value })}
              placeholder="Contoh: Kualitas Standar Industri"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Judul Utama Bagian 1 (Teks Putih) <span className="text-[#FFC857]">*</span>
          </label>
          <input
            type="text"
            value={hero.headlinePart1}
            onChange={(e) => updateSection('hero', { headlinePart1: e.target.value })}
            placeholder="Contoh: Delfea Arrangement Music: "
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Judul Utama Bagian 2 (Gradien Emas-Ungu Bernyala) <span className="text-[#FFC857]">*</span>
          </label>
          <input
            type="text"
            value={hero.headlinePart2Highlight}
            onChange={(e) => updateSection('hero', { headlinePart2Highlight: e.target.value })}
            placeholder="Contoh: Satu Studio untuk Semua Genre dan Ritme."
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FFC857] font-semibold placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Deskripsi / Sub-Headline Paragraf <span className="text-[#FFC857]">*</span>
          </label>
          <textarea
            rows={3}
            value={hero.subheadline}
            onChange={(e) => updateSection('hero', { subheadline: e.target.value })}
            placeholder="Mewujudkan imajinasi musikal Anda tanpa batas genre..."
            className="w-full bg-[#181A24] border border-white/15 rounded-xl p-3.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Button Labels */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white">Teks Tombol Aksi Utama (Hero CTA)</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tombol 1 (Katalog Karya)
            </label>
            <input
              type="text"
              value={hero.btnCatalogText}
              onChange={(e) => updateSection('hero', { btnCatalogText: e.target.value })}
              placeholder="Karya Musik Kami"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tombol 2 (Pameran Genre)
            </label>
            <input
              type="text"
              value={hero.btnGenreText}
              onChange={(e) => updateSection('hero', { btnGenreText: e.target.value })}
              placeholder="Pameran Genre"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Tombol 3 (Konsultasi Emas)
            </label>
            <input
              type="text"
              value={hero.btnConsultText}
              onChange={(e) => updateSection('hero', { btnConsultText: e.target.value })}
              placeholder="Konsultasi Proyek"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#FFC857] focus:outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* 4 Trust Badges */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white">4 Kartu Poin Keunggulan (Trust Badges)</h4>
        <p className="text-xs text-gray-400">
          Ubah judul dan keterangan 4 kartu keunggulan di bawah hero.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hero.trustBadges.map((badge, idx) => (
            <div key={badge.id || idx} className="p-4 rounded-xl bg-[#181A24] border border-white/10 space-y-2.5">
              <div className="text-xs font-mono text-[#FFC857]">Poin #{idx + 1}</div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Judul Keunggulan</label>
                <input
                  type="text"
                  value={badge.title}
                  onChange={(e) => handleBadgeChange(idx, 'title', e.target.value)}
                  className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Keterangan Singkat</label>
                <input
                  type="text"
                  value={badge.subtitle}
                  onChange={(e) => handleBadgeChange(idx, 'subtitle', e.target.value)}
                  className="w-full bg-[#0D0E12] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
