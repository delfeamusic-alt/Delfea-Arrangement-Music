import React from 'react';
import { MessageCircle, Mail, MapPin, Youtube, Instagram, Sparkles, Disc, Globe } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TabContactSocial: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const contact = settings.contact;
  const socials = contact.socialLinks;

  const handleSocialChange = (key: keyof typeof socials, value: string) => {
    updateSection('contact', {
      socialLinks: {
        ...socials,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Primary Contact Info */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>Informasi Kontak Utama & WhatsApp Studio</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Nomor WhatsApp Tampilan (Format Rapi) <span className="text-[#FFC857]">*</span>
            </label>
            <input
              type="text"
              value={contact.whatsappNumber}
              onChange={(e) => updateSection('contact', { whatsappNumber: e.target.value })}
              placeholder="Contoh: +62 812-3456-7890"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Ditampilkan pada footer dan teks informasi kontak.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Nomor WhatsApp Sistem (Angka Saja Tanpa Spasi/Plus) <span className="text-[#FFC857]">*</span>
            </label>
            <input
              type="text"
              value={contact.whatsappRaw}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                updateSection('contact', { whatsappRaw: cleaned });
              }}
              placeholder="Contoh: 6281234567890"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none font-mono"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Digunakan langsung untuk link tombol WhatsApp: <code className="text-[#25D366]">wa.me/{contact.whatsappRaw || '62812...'}</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Alamat Email Resmi <span className="text-[#FFC857]">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={contact.email}
                onChange={(e) => updateSection('contact', { email: e.target.value })}
                placeholder="Contoh: delfeamusic@gmail.com"
                className="w-full bg-[#181A24] border border-white/15 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Lokasi Studio / Wilayah
            </label>
            <div className="relative">
              <input
                type="text"
                value={contact.location}
                onChange={(e) => updateSection('contact', { location: e.target.value })}
                placeholder="Contoh: Jakarta, Indonesia (Studio & Remote Online)"
                className="w-full bg-[#181A24] border border-white/15 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Status Operasional Studio (Badge Header Form)
          </label>
          <input
            type="text"
            value={contact.studioStatus}
            onChange={(e) => updateSection('contact', { studioStatus: e.target.value })}
            placeholder="Contoh: Studio Open / Menerima Slot Produksi Baru"
            className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#FFC857]" />
          <span>Tautan Akun Media Sosial & Profil Streaming Resmi</span>
        </h4>
        <p className="text-xs text-gray-400">
          Tautan ini akan digunakan di tombol footer, profil karya, dan link sosial di seluruh website.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>Channel YouTube Studio</span>
            </label>
            <input
              type="url"
              value={socials.youtube || ''}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              placeholder="https://youtube.com/@delfeamusic"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span>Instagram Studio</span>
            </label>
            <input
              type="url"
              value={socials.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              placeholder="https://instagram.com/delfeamusic"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>TikTok Studio</span>
            </label>
            <input
              type="url"
              value={socials.tiktok || ''}
              onChange={(e) => handleSocialChange('tiktok', e.target.value)}
              placeholder="https://tiktok.com/@delfeamusic"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Disc className="w-3.5 h-3.5 text-green-400" />
              <span>Spotify Artist / Label</span>
            </label>
            <input
              type="url"
              value={socials.spotify || ''}
              onChange={(e) => handleSocialChange('spotify', e.target.value)}
              placeholder="https://open.spotify.com/artist/delfeamusic"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Akun X (Twitter)
            </label>
            <input
              type="url"
              value={socials.x || ''}
              onChange={(e) => handleSocialChange('x', e.target.value)}
              placeholder="https://x.com/delfeamusic"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Facebook Page
            </label>
            <input
              type="url"
              value={socials.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              placeholder="https://facebook.com/delfeamusic"
              className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
