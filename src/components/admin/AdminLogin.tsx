import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight, X, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

interface Props {
  onClose: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onClose }) => {
  const { loginAdmin, settings } = useSiteSettings();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pin)) {
      setError(false);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-md w-full border border-[#FFC857]/40 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC857]/20 to-[#A55EEA]/20 border border-[#FFC857]/40 flex items-center justify-center mx-auto mb-5 text-[#FFC857]">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFC857]/15 border border-[#FFC857]/30 text-xs font-semibold text-[#FFC857] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Studio Management Panel</span>
          </div>
          <h3 className="font-serif-heading font-bold text-2xl text-white">
            Masuk ke Panel Admin
          </h3>
          <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
            Kelola identitas logo, ubah semua teks pada menu dan fitur, nomor kontak WhatsApp, alamat, dan pengaturan website.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Masukkan PIN Admin
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Masukkan PIN keamanan..."
                className={`w-full bg-[#0D0E12] border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  error
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-white/15 focus:border-[#FFC857] focus:ring-1 focus:ring-[#FFC857]'
                }`}
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            {error ? (
              <p className="text-xs text-red-400 mt-1.5 font-medium">
                PIN salah. Silakan coba kembali atau gunakan PIN default: <strong>1234</strong>
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1.5">
                PIN Bawaan (Default): <strong className="text-[#FFC857]">1234</strong> (Dapat diubah di tab Pengaturan)
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-bold text-sm shadow-xl shadow-[#FFC857]/20 hover:shadow-[#FFC857]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Buka Menu Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
