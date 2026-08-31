import React, { useRef } from 'react';
import { Music2, Disc, Sparkles, Headphones, Radio, Mic, Flame, Image as ImageIcon, Upload, Trash2, Eye } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TabBranding: React.FC = () => {
  const { settings, updateSection } = useSiteSettings();
  const branding = settings.branding;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal adalah 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        updateSection('branding', {
          logoType: 'image',
          logoImageUrl: base64Url,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const iconOptions = [
    { id: 'Music2', name: 'Not Balok (Music2)', icon: Music2 },
    { id: 'Disc', name: 'Piringan Vinyl (Disc)', icon: Disc },
    { id: 'Sparkles', name: 'Kilau Emas (Sparkles)', icon: Sparkles },
    { id: 'Headphones', name: 'Headphone Studio', icon: Headphones },
    { id: 'Radio', name: 'Radio / Broadcast', icon: Radio },
    { id: 'Mic', name: 'Microphone Vokal', icon: Mic },
    { id: 'Flame', name: 'Api Kreasi (Flame)', icon: Flame },
  ];

  const accentOptions = [
    { id: 'gold', name: 'Emas Mewah (Gold)', color: '#FFC857' },
    { id: 'purple', name: 'Ungu Mistis (Purple)', color: '#A55EEA' },
    { id: 'cyan', name: 'Cyan Modern (Teal)', color: '#2DD4BF' },
    { id: 'red', name: 'Merah Elegan (Crimson)', color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Live Brand Preview Card */}
      <div className="p-5 rounded-2xl bg-[#141620] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#FFC857] mb-1 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Pratinjau Langsung Header Logo</span>
          </div>
          <p className="text-xs text-gray-400">
            Tampilan logo dan teks merek yang akan tampil di Navbar dan Footer website.
          </p>
        </div>

        {/* Preview Object */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0D0E12] border border-white/15">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#A55EEA] p-[1.5px]">
            <div className="w-full h-full bg-[#0D0E12] rounded-[10px] flex items-center justify-center overflow-hidden">
              {branding.logoType === 'image' && branding.logoImageUrl ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.brandName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music2 className="w-5 h-5 text-[#FFC857]" />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-heading font-bold text-lg text-white tracking-wide">
                {branding.brandName || 'DELFEA'}
              </span>
              {branding.brandBadge && (
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30 font-medium">
                  {branding.brandBadge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-wider text-gray-400 font-light -mt-0.5">
              {branding.brandTagline || 'ARRANGEMENT MUSIC'}
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Nama Utama Studio / Brand <span className="text-[#FFC857]">*</span>
          </label>
          <input
            type="text"
            value={branding.brandName}
            onChange={(e) => updateSection('branding', { brandName: e.target.value })}
            placeholder="Contoh: DELFEA"
            className="w-full bg-[#0D0E12] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Tagline / Sub-Judul Logo
          </label>
          <input
            type="text"
            value={branding.brandTagline}
            onChange={(e) => updateSection('branding', { brandTagline: e.target.value })}
            placeholder="Contoh: ARRANGEMENT MUSIC"
            className="w-full bg-[#0D0E12] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            Label Badge Logo (Pill)
          </label>
          <input
            type="text"
            value={branding.brandBadge}
            onChange={(e) => updateSection('branding', { brandBadge: e.target.value })}
            placeholder="Contoh: STUDIO / OFFICIAL"
            className="w-full bg-[#0D0E12] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
          />
        </div>
      </div>

      {/* Logo Configuration: Icon vs Custom Image */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Format & Gambar Logo Studio</h4>
            <p className="text-xs text-gray-400">Pilih apakah menggunakan ikon vektor elegan atau gambar logo sendiri.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateSection('branding', { logoType: 'icon' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                branding.logoType === 'icon'
                  ? 'bg-[#FFC857] text-[#0D0E12] font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Ikon Vektor
            </button>
            <button
              type="button"
              onClick={() => updateSection('branding', { logoType: 'image' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                branding.logoType === 'image'
                  ? 'bg-[#FFC857] text-[#0D0E12] font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Gambar / Foto Sendiri
            </button>
          </div>
        </div>

        {branding.logoType === 'image' ? (
          <div className="pt-2 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Unggah File Logo (PNG, JPG, SVG, WebP)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-[#FFC857] bg-white/[0.02] hover:bg-[#FFC857]/5 text-xs text-gray-300 hover:text-white flex items-center justify-center gap-2 transition-all"
                >
                  <Upload className="w-4 h-4 text-[#FFC857]" />
                  <span>Pilih File Gambar dari Perangkat</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Atau Masukkan URL Gambar Logo Eksternal
                </label>
                <input
                  type="url"
                  value={branding.logoImageUrl}
                  onChange={(e) => updateSection('branding', { logoImageUrl: e.target.value })}
                  placeholder="https://domainanda.com/logo.png"
                  className="w-full bg-[#181A24] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-[#FFC857] focus:outline-none"
                />
              </div>
            </div>

            {branding.logoImageUrl && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#181A24] border border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={branding.logoImageUrl}
                    alt="Logo preview"
                    className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 border border-white/10"
                  />
                  <div className="text-xs text-gray-300">
                    Gambar logo aktif berhasil dimuat.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateSection('branding', { logoImageUrl: '' })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5"
                  title="Hapus gambar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Pilih Ikon Vektor Bawaan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {iconOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = branding.logoIcon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateSection('branding', { logoIcon: opt.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-[#181A24] border-[#FFC857] text-[#FFC857] shadow-sm shadow-[#FFC857]/20'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-medium truncate">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Brand Accent Selection */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
          Palet Warna Aksen Utama
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {accentOptions.map((acc) => {
            const isSelected = branding.brandAccent === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => updateSection('branding', { brandAccent: acc.id as 'gold' | 'purple' | 'cyan' | 'red' })}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-[#181A24] border-white/30 text-white ring-1 ring-[#FFC857]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: acc.color }}
                />
                <span className="text-xs font-medium truncate">{acc.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
