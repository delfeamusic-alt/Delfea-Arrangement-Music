import React from 'react';
import { Music2, Mail, MessageCircle, MapPin, Instagram, Youtube, Sparkles, Disc, Heart } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();
  const { branding, contact, footer } = settings;
  const social = contact.socialLinks;

  return (
    <footer className="relative border-t border-white/10 bg-[#0A0B0E] pt-16 pb-28 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Studio Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {branding.logoType === 'image' && branding.logoImageUrl ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.brandName}
                  className="w-10 h-10 object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#A55EEA] p-[1.5px]">
                  <div className="w-full h-full bg-[#0D0E12] rounded-[10px] flex items-center justify-center">
                    <Music2 className="w-5 h-5 text-[#FFC857]" />
                  </div>
                </div>
              )}
              <div>
                <div className="font-serif-heading font-bold text-xl text-white tracking-wide">
                  {branding.brandName || 'DELFEA'}
                </div>
                <div className="text-[11px] tracking-wider text-gray-400 font-light -mt-1">
                  {branding.brandTagline || 'ARRANGEMENT MUSIC'}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              {footer.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {social?.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social?.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 flex items-center justify-center text-gray-400 hover:text-cyan-300 transition-all"
                  aria-label="TikTok"
                >
                  <Sparkles className="w-4 h-4" />
                </a>
              )}
              {social?.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#FFC857]/20 border border-white/10 hover:border-[#FFC857]/40 flex items-center justify-center text-gray-400 hover:text-[#FFC857] transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#A55EEA]/20 border border-white/10 hover:border-[#A55EEA]/40 flex items-center justify-center text-gray-400 hover:text-[#A55EEA] transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Katalog & Karya
            </div>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#karya-kami" className="text-[#FFC857] font-semibold hover:underline">✨ Katalog Karya Musik</a></li>
              <li><a href="#showcase-genre" className="hover:text-[#FFC857] transition-colors">Jazz & Mellow Brass</a></li>
              <li><a href="#showcase-genre" className="hover:text-[#FFC857] transition-colors">Bossanova & Acoustic</a></li>
              <li><a href="#showcase-genre" className="hover:text-[#FFC857] transition-colors">Modern Pop Production</a></li>
              <li><a href="#showcase-genre" className="hover:text-[#FFC857] transition-colors">Dangdut Kendang Futuristic</a></li>
              <li><a href="#showcase-genre" className="hover:text-[#FFC857] transition-colors">Majestic Gamelan Nusantara</a></li>
              <li><a href="#fusion-lab" className="hover:text-[#A55EEA] transition-colors">Cross-Genre Fusion Lab</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Layanan Utama
            </div>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li><a href="#layanan" className="hover:text-[#FFC857] transition-colors">Aransemen Kustom</a></li>
              <li><a href="#layanan" className="hover:text-[#FFC857] transition-colors">Produksi Musik Penuh</a></li>
              <li><a href="#layanan" className="hover:text-[#FFC857] transition-colors">Penggabungan Antar-Genre</a></li>
              <li><a href="#workflow" className="hover:text-[#FFC857] transition-colors">Alur Standar Industri</a></li>
              <li><a href="#kontak" className="hover:text-[#FFC857] transition-colors">Pemeriksaan File Demo</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Kontak Studio
            </div>
            <ul className="space-y-3 text-xs text-gray-400">
              {contact.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#FFC857] shrink-0 mt-0.5" />
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.whatsappNumber && (
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                  <span>WhatsApp: {contact.whatsappNumber}</span>
                </li>
              )}
              {contact.location && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#A55EEA] shrink-0 mt-0.5" />
                  <span>{contact.location}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            {footer.copyrightText || `© ${new Date().getFullYear()} ${branding.brandName || 'Delfea'} Arrangement Music. Seluruh Hak Cipta Dilindungi.`}
          </div>
          <div className="flex items-center gap-1">
            <span>{footer.slogan || 'Satu Studio untuk Semua Genre dan Ritme.'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
