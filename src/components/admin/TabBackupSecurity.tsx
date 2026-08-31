import React, { useState, useRef } from 'react';
import { KeyRound, Download, Upload, RotateCcw, ShieldCheck, Check, AlertTriangle } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const TabBackupSecurity: React.FC = () => {
  const { settings, changeAdminPin, exportSettingsJSON, importSettingsJSON, resetToDefaults } = useSiteSettings();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const importFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin.trim() || newPin.length < 3) {
      setPinMessage({ type: 'error', text: 'PIN minimal terdiri dari 3 karakter atau angka.' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMessage({ type: 'error', text: 'Konfirmasi PIN tidak cocok dengan PIN baru.' });
      return;
    }

    if (changeAdminPin(newPin)) {
      setPinMessage({ type: 'success', text: 'PIN Admin berhasil diperbarui!' });
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinMessage(null), 4000);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (readEvent) => {
        const content = readEvent.target?.result as string;
        const result = importSettingsJSON(content);
        if (result.success) {
          setImportMessage({ type: 'success', text: result.message });
        } else {
          setImportMessage({ type: 'error', text: result.message });
        }
        setTimeout(() => setImportMessage(null), 5000);
      };
      reader.readAsText(file);
    }
  };

  const handleExecuteReset = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
    alert('Pengaturan website telah berhasil dikembalikan ke format awal pabrikan.');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Change Admin PIN */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#FFC857]" />
          <span>Keamanan & PIN Akses Panel Admin</span>
        </h4>
        <p className="text-xs text-gray-400">
          PIN saat ini: <strong className="text-[#FFC857] font-mono">{settings.adminPin || '1234'}</strong>. Anda dapat menggantinya kapan saja untuk menjaga keamanan web Anda.
        </p>

        <form onSubmit={handleChangePin} className="space-y-3 max-w-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">PIN Baru</label>
              <input
                type="password"
                required
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="PIN Baru..."
                className="w-full bg-[#181A24] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">Ulangi PIN Baru</label>
              <input
                type="password"
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Konfirmasi PIN..."
                className="w-full bg-[#181A24] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFC857] focus:outline-none"
              />
            </div>
          </div>

          {pinMessage && (
            <div
              className={`p-2.5 rounded-lg text-xs font-medium ${
                pinMessage.type === 'success' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {pinMessage.text}
            </div>
          )}

          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#FFC857] hover:text-[#0D0E12] text-xs font-bold text-white transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simpan PIN Baru</span>
          </button>
        </form>
      </div>

      {/* Export & Import Backup */}
      <div className="p-5 rounded-2xl bg-[#0D0E12] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Download className="w-4 h-4 text-[#A55EEA]" />
          <span>Cadangan & Impor Pengaturan Website (JSON)</span>
        </h4>
        <p className="text-xs text-gray-400">
          Simpan seluruh teks, nomor kontak, logo, dan susunan layanan ke dalam file JSON agar mudah dicadangkan atau dipindahkan.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={exportSettingsJSON}
            className="py-2.5 px-4 rounded-xl bg-[#181A24] border border-[#FFC857]/30 hover:border-[#FFC857] text-xs font-bold text-[#FFC857] hover:bg-[#FFC857]/10 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Cadangan Pengaturan (.json)</span>
          </button>

          <input
            ref={importFileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => importFileInputRef.current?.click()}
            className="py-2.5 px-4 rounded-xl bg-[#181A24] border border-white/15 hover:border-white/30 text-xs font-bold text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-gray-400" />
            <span>Pulihkan dari File Cadangan (.json)</span>
          </button>
        </div>

        {importMessage && (
          <div
            className={`p-2.5 rounded-lg text-xs font-medium ${
              importMessage.type === 'success' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {importMessage.text}
          </div>
        )}
      </div>

      {/* Factory Reset */}
      <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
        <h4 className="text-sm font-bold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Kembalikan ke Pengaturan Default Awal</span>
        </h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          Mengembalikan semua teks menu, nama studio, nomor WhatsApp, dan deskripsi ke pengaturan default bawaan aplikasi.
        </p>

        {!isResetConfirmOpen ? (
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="py-2 px-3.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Semua Teks & Logo</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 space-y-2">
            <p className="text-xs text-red-200 font-semibold">
              Apakah Anda yakin ingin menghapus perubahan dan mereset ke pengaturan awal?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                Ya, Reset Sekarang
              </button>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
