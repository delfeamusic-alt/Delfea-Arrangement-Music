import React from 'react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TabFooter: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const footer = settings.footer;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white">Teks Informasi & Hak Cipta Bagian Footer</h4>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Deskripsi Profil Studio di Footer
          </label>
          <textarea
            rows={3}
            value={footer.description}
            onChange={(e) => updateSection('footer', { description: e.target.value })}
            className="w-full bg-[#181A24] border border-white/15 rounded-xl p-3 text-sm text-white focus:border-[#FFC857] focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Teks Hak Cipta (Copyright)
          </label>
          <input
            type="text"
            value={footer.copyrightText}
            onChange={(e) => updateSection('footer', { copyrightText: e.target.value })}
            placeholder="Contoh: Delfea Arrangement Music. Seluruh Hak Cipta Dilindungi."
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Slogan Footer Bawah
          </label>
          <input
            type="text"
            value={footer.slogan}
            onChange={(e) => updateSection('footer', { slogan: e.target.value })}
            placeholder="Contoh: Satu Studio untuk Semua Genre dan Ritme."
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
