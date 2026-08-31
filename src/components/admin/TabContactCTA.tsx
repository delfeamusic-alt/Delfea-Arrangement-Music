import React from 'react';
import { MessageSquare, Sparkles, Send } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TabContactCTA: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const contactSec = settings.contactSection;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Visual Ambient Banner Texts */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC857]" />
          <span>Teks Banner Hitam Ambient (Call to Action Banner)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Badge Label Banner
            </label>
            <input
              type="text"
              value={contactSec.bannerBadge}
              onChange={(e) => updateSection('contactSection', { bannerBadge: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Teks Tombol Aksi Banner
            </label>
            <input
              type="text"
              value={contactSec.bannerButtonText}
              onChange={(e) => updateSection('contactSection', { bannerButtonText: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none font-semibold text-[#FFC857]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Judul Besar Banner CTA (Headline)
          </label>
          <input
            type="text"
            value={contactSec.bannerTitle}
            onChange={(e) => updateSection('contactSection', { bannerTitle: e.target.value })}
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Deskripsi Paragraf Banner CTA
          </label>
          <textarea
            rows={2}
            value={contactSec.bannerDescription}
            onChange={(e) => updateSection('contactSection', { bannerDescription: e.target.value })}
            className="w-full bg-[#181A24] border border-white/15 rounded-xl p-3 text-sm text-white focus:border-[#FFC857] focus:outline-none"
          />
        </div>
      </div>

      {/* Form Consultation Container Texts */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#25D366]" />
          <span>Teks Formulir Pengajuan Proyek & Template WhatsApp</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Judul Header Formulir
            </label>
            <input
              type="text"
              value={contactSec.formTitle}
              onChange={(e) => updateSection('contactSection', { formTitle: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Keterangan Sub-Header Formulir
            </label>
            <input
              type="text"
              value={contactSec.formDescription}
              onChange={(e) => updateSection('contactSection', { formDescription: e.target.value })}
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#FFC857] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Template Kalimat Salam Awal WhatsApp
          </label>
          <input
            type="text"
            value={contactSec.whatsappGreetingTemplate}
            onChange={(e) => updateSection('contactSection', { whatsappGreetingTemplate: e.target.value })}
            placeholder="Contoh: Halo {brandName}, saya ingin berkonsultasi mengenai proyek musik:"
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#FFC857] focus:outline-none"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Gunakan tag <code>{'{brandName}'}</code> untuk memasukkan nama studio Anda secara dinamis.
          </p>
        </div>
      </div>
    </div>
  );
};
