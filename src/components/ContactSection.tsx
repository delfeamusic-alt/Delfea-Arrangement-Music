import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileAudio, Check, Sparkles, MessageCircle, AlertCircle, X, Music, CheckCircle2, Play, Pause, Trash2, ArrowRight } from 'lucide-react';
import { ProjectInquiry, GenreId } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface Props {
  preselectedGenre?: string;
  preselectedService?: string;
}

export const ContactSection: React.FC<Props> = ({ preselectedGenre, preselectedService }) => {
  const { settings } = useSiteSettings();
  const { branding, contact, contactSection, genreShowcase } = settings;
  const genres = genreShowcase.genres;

  const [fullName, setFullName] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>(preselectedGenre || 'jazz');
  const [secondaryGenre, setSecondaryGenre] = useState<string>('');
  const [projectPackage, setProjectPackage] = useState<'arrangement' | 'full_production' | 'fusion_cross' | 'custom'>(
    preselectedService === 'full-production'
      ? 'full_production'
      : preselectedService === 'cross-genre-fusion'
      ? 'fusion_cross'
      : 'arrangement'
  );
  const [conceptNotes, setConceptNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    name: string;
    size: string;
    url: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<ProjectInquiry | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const demoAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (preselectedGenre) {
      setSelectedGenre(preselectedGenre);
    }
  }, [preselectedGenre]);

  useEffect(() => {
    if (preselectedService) {
      if (preselectedService === 'full-production') setProjectPackage('full_production');
      else if (preselectedService === 'cross-genre-fusion') setProjectPackage('fusion_cross');
      else setProjectPackage('arrangement');
    }
  }, [preselectedService]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const blobUrl = URL.createObjectURL(file);
    setUploadedFile({
      file,
      name: file.name,
      size: `${sizeInMB} MB`,
      url: blobUrl,
    });
  };

  const handleRemoveFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.url);
      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (demoAudioRef.current) {
        demoAudioRef.current.pause();
        setIsPlayingDemo(false);
      }
    }
  };

  const togglePlayDemo = () => {
    if (!demoAudioRef.current && uploadedFile) {
      demoAudioRef.current = new Audio(uploadedFile.url);
      demoAudioRef.current.onended = () => setIsPlayingDemo(false);
    }

    if (demoAudioRef.current) {
      if (isPlayingDemo) {
        demoAudioRef.current.pause();
        setIsPlayingDemo(false);
      } else {
        demoAudioRef.current.play().then(() => setIsPlayingDemo(true)).catch(() => setIsPlayingDemo(false));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactValue.trim()) return;

    setIsSubmitting(true);

    const inquiry: ProjectInquiry = {
      fullName,
      contactMethod,
      contactValue,
      primaryGenre: selectedGenre,
      fusionWithGenre: secondaryGenre || undefined,
      conceptNotes,
      projectPackage,
      demoFileName: uploadedFile?.name,
      demoFileSize: uploadedFile?.file.size,
    };

    setTimeout(() => {
      setSubmittedData(inquiry);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 600);
  };

  const generateWhatsAppUrl = () => {
    const packageLabels = {
      arrangement: 'Aransemen Kustom',
      full_production: 'Produksi Musik Penuh',
      fusion_cross: 'Cross-Genre Fusion',
      custom: 'Custom Project',
    };

    const text = `Halo ${branding.brandName || 'Delfea'} Arrangement Music, saya ingin berkonsultasi mengenai proyek musik:
• Nama: ${fullName || 'Klien'}
• Kontak: ${contactValue || '-'} (${contactMethod})
• Paket Layanan: ${packageLabels[projectPackage]}
• Genre Utama: ${selectedGenre.toUpperCase()}${secondaryGenre ? ` (Fusion dengan: ${secondaryGenre})` : ''}
• Catatan Konsep: ${conceptNotes || 'Belum ada catatan'}
• Lampiran Draf: ${uploadedFile ? uploadedFile.name : 'Akan dikirim via chat'}

Mohon informasi jadwal produksi dan estimasi penawarannya. Terima kasih!`;

    const rawNum = contact.whatsappNumber || '+62 812-3456-7890';
    const cleanNum = rawNum.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="kontak" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 4. Visual Banner (Dark Ambient Banner with Prominent Bold Text) */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/15 p-8 sm:p-14 mb-16 shadow-2xl">
        {/* Ambient Dark Lights */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#FFC857]/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#A55EEA]/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFC857]/15 border border-[#FFC857]/30 text-xs font-semibold text-[#FFC857] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC857]" />
            <span>{contactSection.bannerBadge || 'Mulai Kolaborasi Artistik'}</span>
          </div>

          <h2
            id="cta-bold-headline"
            className="font-serif-heading font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15] mb-6 text-glow-gold"
          >
            {contactSection.bannerTitle || 'Siap Mengubah Gagasan Musik Anda Menjadi Mahakarya?'}
          </h2>

          <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            {contactSection.bannerDescription || 'Kirimkan ide, melodi vokal mentah, atau draft rekaman Anda. Tim arranger siap mentransformasikannya menjadi produksi audio berstandar industri.'}
          </p>

          <a
            href="#order-form-container"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-bold text-sm sm:text-base tracking-wide shadow-xl shadow-[#FFC857]/30 hover:shadow-[#FFC857]/60 hover:scale-105 active:scale-95 transition-all duration-200 glow-gold"
          >
            <Sparkles className="w-5 h-5 text-[#0D0E12]" />
            <span>{contactSection.bannerButtonText || 'Mulai Aransemen Musikmu'}</span>
          </a>
        </div>
      </div>

      {/* Interactive Consultation Form Container */}
      <div
        id="order-form-container"
        className="glass-card rounded-3xl p-6 sm:p-10 border border-white/15 max-w-4xl mx-auto shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <h3 className="font-serif-heading font-bold text-2xl text-white">
              {contactSection.formTitle || 'Formulir Pengajuan Proyek & Konsultasi'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {contactSection.formDescription || 'Isi data konsep musik Anda di bawah ini untuk mendapatkan estimasi produksi & jadwal studio.'}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#FFC857]">
            <span className="w-2 h-2 rounded-full bg-[#FFC857] animate-pulse" />
            <span>Studio Open</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                Nama Lengkap / Nama Artis / Band <span className="text-[#FFC857]">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Adrian Wijaya"
                className="w-full bg-[#0D0E12] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:ring-1 focus:ring-[#FFC857] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Kontak Utama <span className="text-[#FFC857]">*</span>
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setContactMethod('whatsapp')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      contactMethod === 'whatsapp'
                        ? 'bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      contactMethod === 'email'
                        ? 'bg-[#FFC857]/20 text-[#FFC857] border border-[#FFC857]/40'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>
              <input
                type={contactMethod === 'email' ? 'email' : 'tel'}
                required
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={contactMethod === 'whatsapp' ? '0812-XXXX-XXXX (WhatsApp)' : 'emailanda@domain.com'}
                className="w-full bg-[#0D0E12] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:ring-1 focus:ring-[#FFC857] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Section 2: Service Package */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2.5">
              Pilihan Layanan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProjectPackage('arrangement')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  projectPackage === 'arrangement'
                    ? 'bg-[#181A24] border-[#FFC857] shadow-md shadow-[#FFC857]/15'
                    : 'bg-[#0D0E12] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">Aransemen Kustom</div>
                <div className="text-[11px] text-gray-400">Pengolahan melodi & instrumen</div>
              </button>

              <button
                type="button"
                onClick={() => setProjectPackage('full_production')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  projectPackage === 'full_production'
                    ? 'bg-[#181A24] border-[#FFC857] shadow-md shadow-[#FFC857]/15'
                    : 'bg-[#0D0E12] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">Produksi Musik Penuh</div>
                <div className="text-[11px] text-gray-400">Komposisi, tracking, mix & master</div>
              </button>

              <button
                type="button"
                onClick={() => setProjectPackage('fusion_cross')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  projectPackage === 'fusion_cross'
                    ? 'bg-[#181A24] border-[#A55EEA] shadow-md shadow-[#A55EEA]/15'
                    : 'bg-[#0D0E12] border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">Cross-Genre Fusion</div>
                <div className="text-[11px] text-gray-400">Peleburan 2+ genre berbeda</div>
              </button>
            </div>
          </div>

          {/* Section 3: Genre Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2.5">
              Pilihan Genre Utama
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {genres.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGenre(g.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                    selectedGenre === g.id
                      ? 'bg-[#FFC857] text-[#0D0E12] font-bold border-[#FFC857] shadow-md shadow-[#FFC857]/20'
                      : 'bg-[#0D0E12] border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Fusion Partner Genre if Cross-Genre is selected */}
          {projectPackage === 'fusion_cross' && (
            <div className="p-4 rounded-xl bg-[#A55EEA]/10 border border-[#A55EEA]/30">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C084FC] mb-1.5">
                Peleburan dengan Genre Kedua (Opsional)
              </label>
              <input
                type="text"
                value={secondaryGenre}
                onChange={(e) => setSecondaryGenre(e.target.value)}
                placeholder="Contoh: EDM Cyber, Orchestral Film Score, Synthwave, Rock"
                className="w-full bg-[#0D0E12] border border-[#A55EEA]/30 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:border-[#A55EEA] focus:outline-none"
              />
            </div>
          )}

          {/* Section 4: Concept Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Catatan Konsep Singkat & Referensi Musik
            </label>
            <textarea
              rows={4}
              value={conceptNotes}
              onChange={(e) => setConceptNotes(e.target.value)}
              placeholder="Ceritakan target nuansa lagu, tempo (BPM perkiraan), instrumen yang diinginkan, atau referensi lagu dari artis favorit Anda..."
              className="w-full bg-[#0D0E12] border border-white/15 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:border-[#FFC857] focus:ring-1 focus:ring-[#FFC857] focus:outline-none transition-colors"
            />
          </div>

          {/* Section 5: Audio Demo Upload (Drag-and-Drop & File Picker) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2 flex items-center justify-between">
              <span>Opsi Pengunggahan File Draf / Audio Demo Mentah</span>
              <span className="text-[11px] text-gray-400 font-normal">MP3, WAV, M4A, ZIP (Maks. 50MB)</span>
            </label>

            {!uploadedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-[#FFC857] bg-[#FFC857]/5'
                    : 'border-white/15 bg-[#0D0E12]/50 hover:border-white/30 hover:bg-white/[0.02]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.zip,.rar"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-[#181A24] border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <Upload className={`w-6 h-6 ${isDragging ? 'text-[#FFC857]' : 'text-gray-400'}`} />
                </div>
                <div className="text-sm font-semibold text-white mb-1">
                  Tarik & Lepas File Draf Audio di Sini, atau <span className="text-[#FFC857] underline">Pilih File</span>
                </div>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Rekaman suara HP, panduan gitar akustik, stems mentah, atau coretan melodi sangat diterima.
                </p>
              </div>
            ) : (
              <div className="bg-[#181A24] border border-[#FFC857]/40 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={togglePlayDemo}
                    className="w-10 h-10 rounded-lg bg-[#FFC857] text-[#0D0E12] flex items-center justify-center shrink-0 hover:bg-[#FFAA00]"
                    title="Uji Putar File Unggahan"
                  >
                    {isPlayingDemo ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {uploadedFile.name}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {uploadedFile.size} • Siap Dilampirkan ke Tim Arranger
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Hapus File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-inquiry-btn"
              className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-bold text-sm tracking-wide shadow-xl shadow-[#FFC857]/30 hover:shadow-[#FFC857]/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Memproses Pengajuan...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Formulir Pengajuan Proyek</span>
                </>
              )}
            </button>

            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp Langsung</span>
            </a>
          </div>
        </form>
      </div>

      {/* Success Confirmation Modal */}
      {isSuccessModalOpen && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-[#FFC857]/40 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FFC857]/20 border border-[#FFC857]/40 flex items-center justify-center mx-auto mb-4 text-[#FFC857]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h4 className="font-serif-heading font-bold text-2xl text-white text-center mb-2">
              Pengajuan Berhasil Diterima!
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 text-center mb-6 leading-relaxed">
              Terima kasih, <strong>{submittedData.fullName}</strong>. Tim arranger {branding.brandName || 'Delfea'} Arrangement Music akan segera meninjau konsep dan menghubungi Anda dalam 1x24 jam.
            </p>

            {/* Summary Box */}
            <div className="bg-[#0D0E12] rounded-xl p-4 border border-white/10 text-xs space-y-2 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Genre Utama:</span>
                <strong className="text-white uppercase">{submittedData.primaryGenre}</strong>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Kontak:</span>
                <strong className="text-white">{submittedData.contactValue}</strong>
              </div>
              {submittedData.demoFileName && (
                <div className="flex justify-between text-gray-400">
                  <span>File Draf:</span>
                  <strong className="text-[#FFC857] truncate max-w-[200px]">{submittedData.demoFileName}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Teruskan ke WhatsApp Arranger</span>
              </a>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="px-5 py-3 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
