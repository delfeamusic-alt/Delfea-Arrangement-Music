import React, { useState, useEffect } from 'react';
import {
  X,
  Music,
  Sparkles,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Disc,
  Upload,
  Link as LinkIcon,
  Check,
  Radio,
  Sliders,
  FileAudio,
  Play,
  ExternalLink,
  Eye,
  Trash2,
} from 'lucide-react';
import { PortfolioTrack, SocialPlatformLinks } from '../types';
import {
  extractYouTubeId,
  getYouTubeThumbnailUrl,
  normalizeSocialUrl,
} from '../utils/mediaHelper';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (track: PortfolioTrack) => void;
  onDelete?: (track: PortfolioTrack) => void;
  initialTrack?: PortfolioTrack | null;
}

const GRADIENT_PRESETS = [
  { label: 'Gold Amber', value: 'from-[#FFC857] via-[#FF8A00] to-[#A55EEA]' },
  { label: 'Electric Purple', value: 'from-[#A55EEA] via-[#7B2CBF] to-[#3A0CA3]' },
  { label: 'Sunset Glow', value: 'from-[#FF007A] via-[#7928CA] to-[#FFC857]' },
  { label: 'Cyber Blue', value: 'from-[#00F0FF] via-[#7000FF] to-[#FF007A]' },
  { label: 'Deep Emerald', value: 'from-[#10B981] via-[#059669] to-[#047857]' },
  { label: 'Midnight Onyx', value: 'from-[#2D3748] via-[#1A202C] to-[#0D0E12]' },
];

export const TrackEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTrack,
}) => {
  const isEditing = Boolean(initialTrack);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('Pop Modern');
  const [customGenre, setCustomGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
  const [duration, setDuration] = useState('3:30');
  const [bpm, setBpm] = useState<number>(120);
  const [description, setDescription] = useState('');
  const [instrumentationInput, setInstrumentationInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverGradient, setCoverGradient] = useState(GRADIENT_PRESETS[0].value);
  const [audioPreviewType, setAudioPreviewType] = useState<PortfolioTrack['audioPreviewType']>('synth-pop');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Social Links (Initialized empty so unentered platforms do not show fake buttons)
  const [youtube, setYoutube] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [instagram, setInstagram] = useState('');
  const [xLink, setXLink] = useState('');
  const [facebook, setFacebook] = useState('');
  const [spotify, setSpotify] = useState('');

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Computed YouTube detection
  const detectedYouTubeId = extractYouTubeId(youtube);
  const youtubeThumbnail = detectedYouTubeId ? getYouTubeThumbnailUrl(youtube) : null;

  useEffect(() => {
    if (initialTrack) {
      setTitle(initialTrack.title || '');
      setArtist(initialTrack.artist || '');
      setGenre(initialTrack.genre || 'Pop Modern');
      setReleaseYear(initialTrack.releaseYear || new Date().getFullYear().toString());
      setDuration(initialTrack.duration || '3:30');
      setBpm(initialTrack.bpm || 120);
      setDescription(initialTrack.description || '');
      setInstrumentationInput(initialTrack.instrumentation?.join(', ') || '');
      setTagsInput(initialTrack.tags?.join(', ') || '');
      setCoverGradient(initialTrack.coverGradient || GRADIENT_PRESETS[0].value);
      setAudioPreviewType(initialTrack.audioPreviewType || 'synth-pop');
      setCustomAudioUrl(initialTrack.customAudioUrl || '');
      setIsFeatured(Boolean(initialTrack.isFeatured));

      setYoutube(initialTrack.links?.youtube || '');
      setTiktok(initialTrack.links?.tiktok || '');
      setInstagram(initialTrack.links?.instagram || '');
      setXLink(initialTrack.links?.x || '');
      setFacebook(initialTrack.links?.facebook || '');
      setSpotify(initialTrack.links?.spotify || '');
    } else {
      // Reset form with clean empty inputs
      setTitle('');
      setArtist('Delfea Studio');
      setGenre('Pop Modern');
      setCustomGenre('');
      setReleaseYear(new Date().getFullYear().toString());
      setDuration('3:30');
      setBpm(120);
      setDescription('');
      setInstrumentationInput('Piano, Akustik Gitar, Drums, Synth Bass');
      setTagsInput('Aransemen Eksklusif, Mastered 48kHz');
      setCoverGradient(GRADIENT_PRESETS[0].value);
      setAudioPreviewType('synth-pop');
      setCustomAudioUrl('');
      setIsFeatured(false);
      setYoutube('');
      setTiktok('');
      setInstagram('');
      setXLink('');
      setFacebook('');
      setSpotify('');
      setUploadedFileName(null);
    }
  }, [initialTrack, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCustomAudioUrl(blobUrl);
      setAudioPreviewType('custom-file');
      setUploadedFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalGenre = genre === 'Custom' ? (customGenre.trim() || 'Custom Genre') : genre;
    const instrumentation = instrumentationInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Normalize all links properly
    const links: SocialPlatformLinks = {};
    if (youtube.trim()) {
      links.youtube = normalizeSocialUrl(youtube.trim(), 'youtube');
    }
    if (tiktok.trim()) {
      links.tiktok = normalizeSocialUrl(tiktok.trim(), 'tiktok');
    }
    if (instagram.trim()) {
      links.instagram = normalizeSocialUrl(instagram.trim(), 'instagram');
    }
    if (xLink.trim()) {
      links.x = normalizeSocialUrl(xLink.trim(), 'x');
    }
    if (facebook.trim()) {
      links.facebook = normalizeSocialUrl(facebook.trim(), 'facebook');
    }
    if (spotify.trim()) {
      links.spotify = normalizeSocialUrl(spotify.trim(), 'spotify');
    }

    const trackData: PortfolioTrack = {
      id: initialTrack ? initialTrack.id : `track-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim() || 'Delfea Studio',
      genre: finalGenre,
      releaseYear: releaseYear.trim() || new Date().getFullYear().toString(),
      duration: duration.trim() || '3:30',
      bpm: Number(bpm) || 120,
      description: description.trim() || 'Karya aransemen musik orkestratif profesional dari studio Delfea Arrangement Music.',
      instrumentation: instrumentation.length > 0 ? instrumentation : ['Full Studio Production'],
      tags: tags.length > 0 ? tags : ['Aransemen Resmi'],
      coverGradient,
      audioPreviewType,
      customAudioUrl: customAudioUrl || undefined,
      links,
      isFeatured,
      createdAt: initialTrack ? initialTrack.createdAt : new Date().toISOString(),
    };

    onSave(trackData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-[#FFC857]/30 shadow-2xl shadow-black/90 p-6 sm:p-8 my-8 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#A55EEA] p-[1.5px]">
            <div className="w-full h-full bg-[#0D0E12] rounded-[10px] flex items-center justify-center">
              <Music className="w-5 h-5 text-[#FFC857]" />
            </div>
          </div>
          <div>
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white">
              {isEditing ? 'Ubah Informasi Karya Musik' : 'Tambah Karya Musik Baru'}
            </h3>
            <p className="text-xs text-gray-400">
              Kelola katalog aransemen yang telah diproduksi beserta tautan media sosial & streaming.
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Informasi Utama */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#FFC857] flex items-center gap-2">
              <Disc className="w-4 h-4" /> 1. Informasi Utama Musik
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Judul Lagu / Karya *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Senja di Malioboro (Bossanova Rework)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-sm text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Artis / Klien / Kolaborator *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Delfea feat. Sarah Melody"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-sm text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Genre Musik
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-sm text-white"
                >
                  <option value="Jazz & Brass">Jazz & Brass Mellow</option>
                  <option value="Bossanova Acoustic">Bossanova Acoustic</option>
                  <option value="Pop Modern">Pop Modern Radio-Ready</option>
                  <option value="Dangdut Modern Groove">Dangdut Koplo Modern</option>
                  <option value="Gamelan Etnik Orkestra">Gamelan Etnik Orkestra</option>
                  <option value="Gamelan x EDM Fusion">Gamelan x EDM Fusion</option>
                  <option value="Jazz x Dangdut Fusion">Jazz x Dangdut Fusion</option>
                  <option value="Cinematic Soundtrack">Cinematic Soundtrack / Film Score</option>
                  <option value="R&B / Soul">R&B / Soul Smooth</option>
                  <option value="Rock / Metal Orchestral">Rock / Metal Orchestral</option>
                  <option value="Custom">Lainnya (Tulis Sendiri)</option>
                </select>
              </div>

              {genre === 'Custom' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Nama Genre Kustom
                  </label>
                  <input
                    type="text"
                    placeholder="Nama genre baru..."
                    value={customGenre}
                    onChange={(e) => setCustomGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-sm text-white placeholder-gray-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Tahun Rilis
                </label>
                <input
                  type="text"
                  placeholder="2025"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-sm text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Durasi & BPM
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    placeholder="3:45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="px-2.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-xs text-white text-center"
                    title="Durasi (contoh 3:45)"
                  />
                  <input
                    type="number"
                    placeholder="BPM"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
                    className="px-2 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-xs text-white text-center"
                    title="BPM (Tempo)"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Cerita & Konsep Aransemen
              </label>
              <textarea
                rows={2}
                placeholder="Jelaskan konsep aransemen, struktur harmoni, atau sentuhan unik pada karya ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-sm text-white placeholder-gray-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Instrumen Utama (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Saron, Bonang, 808 Bass, Synth Lead"
                  value={instrumentationInput}
                  onChange={(e) => setInstrumentationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-xs text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Tag Sorotan (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Viral TikTok, Radio Ready, Mastered 48kHz"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-xs text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tautan Media Sosial & Streaming */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#A55EEA] flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> 2. Link Media Sosial & Platform Streaming
              </h4>
              <span className="text-[11px] text-[#FFC857] font-medium hidden sm:inline">
                Mendukung YouTube, TikTok, IG, Spotify
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Sematkan link rilis resmi di berbagai platform agar calon klien bisa langsung mendengarkan atau menonton karya Anda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* YouTube */}
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                    <Youtube className="w-4 h-4 text-red-500" />
                    <span>YouTube Video / Shorts / Klip</span>
                  </div>
                  {detectedYouTubeId && (
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 border border-red-500/30">
                      <Check className="w-3 h-3 text-emerald-400" /> ID: {detectedYouTubeId}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=... atau youtu.be/..."
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-red-500/30 focus:border-red-500 focus:outline-none text-xs text-white placeholder-gray-500"
                />

                {/* Live YouTube Preview Box */}
                {youtubeThumbnail && (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-black/60 border border-red-500/30 animate-in fade-in duration-150">
                    <div className="relative w-16 h-10 rounded-md overflow-hidden bg-black shrink-0 border border-white/10">
                      <img
                        src={youtubeThumbnail}
                        alt="YouTube Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium text-white truncate">
                        Video YouTube Terdeteksi ✓
                      </div>
                      <div className="text-[10px] text-gray-400 truncate">
                        Siap diputar langsung di galeri karya
                      </div>
                    </div>
                    {youtube.trim() && (
                      <a
                        href={youtube.startsWith('http') ? youtube : `https://${youtube}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white"
                        title="Tes Buka Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* TikTok */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>TikTok URL / Sound Link</span>
                </div>
                <input
                  type="text"
                  placeholder="https://tiktok.com/@.../video/..."
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-cyan-500/30 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-gray-500"
                />
                <div className="text-[10px] text-gray-400">
                  Mendukung link sound atau video TikTok
                </div>
              </div>

              {/* Instagram */}
              <div className="p-3 rounded-xl bg-pink-950/20 border border-pink-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-400">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram URL / Reels / Post</span>
                </div>
                <input
                  type="text"
                  placeholder="https://instagram.com/reel/... atau /p/..."
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-pink-500/30 focus:border-pink-500 focus:outline-none text-xs text-white placeholder-gray-500"
                />
                <div className="text-[10px] text-gray-400">
                  Mendukung postingan feed & reels Instagram
                </div>
              </div>

              {/* Spotify */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>Spotify Track / Album Link</span>
                </div>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  value={spotify}
                  onChange={(e) => setSpotify(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-emerald-500/30 focus:border-emerald-500 focus:outline-none text-xs text-white placeholder-gray-500"
                />
                <div className="text-[10px] text-gray-400">
                  Link rilis resmi di platform Spotify
                </div>
              </div>

              {/* X.com / Twitter */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                  <Twitter className="w-4 h-4 text-gray-300" />
                  <span>X.com (Twitter) URL</span>
                </div>
                <input
                  type="text"
                  placeholder="https://x.com/username/status/..."
                  value={xLink}
                  onChange={(e) => setXLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 focus:border-gray-400 focus:outline-none text-xs text-white placeholder-gray-500"
                />
              </div>

              {/* Facebook */}
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <Facebook className="w-4 h-4 text-blue-500" />
                  <span>Facebook Post / Watch URL</span>
                </div>
                <input
                  type="text"
                  placeholder="https://facebook.com/..."
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12141A] border border-blue-500/30 focus:border-blue-500 focus:outline-none text-xs text-white placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pengaturan Audio Preview & Cover */}
          <div className="space-y-4 pt-3 border-t border-white/10">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#FFC857] flex items-center gap-2">
              <Sliders className="w-4 h-4" /> 3. Audio Preview & Tampilan Visual
            </h4>

            {/* Color preset selection */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Pilih Nuansa Cover Card Art
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setCoverGradient(preset.value)}
                    className={`h-10 rounded-xl bg-gradient-to-br ${preset.value} flex items-center justify-center transition-all ${
                      coverGradient === preset.value
                        ? 'ring-2 ring-white scale-105 shadow-md shadow-black'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    {coverGradient === preset.value && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Preview Choice */}
            <div className="p-4 rounded-xl bg-[#12141A] border border-white/10 space-y-3">
              <label className="block text-xs font-medium text-gray-300">
                Mode Audio Demo Player di Aplikasi:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAudioPreviewType('synth-fusion')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    audioPreviewType === 'synth-fusion'
                      ? 'bg-[#FFC857]/20 border-[#FFC857] text-[#FFC857]'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Sintesis Gamelan/EDM
                </button>
                <button
                  type="button"
                  onClick={() => setAudioPreviewType('synth-bossanova')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    audioPreviewType === 'synth-bossanova'
                      ? 'bg-[#A55EEA]/20 border-[#A55EEA] text-[#A55EEA]'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Sintesis Bossanova
                </button>
                <button
                  type="button"
                  onClick={() => setAudioPreviewType('synth-jazz')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    audioPreviewType === 'synth-jazz'
                      ? 'bg-[#FFC857]/20 border-[#FFC857] text-[#FFC857]'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Sintesis Jazz Brass
                </button>
                <button
                  type="button"
                  onClick={() => setAudioPreviewType('synth-dangdut')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    audioPreviewType === 'synth-dangdut'
                      ? 'bg-[#FF007A]/20 border-[#FF007A] text-[#FF007A]'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Sintesis Dangdut
                </button>
                <button
                  type="button"
                  onClick={() => setAudioPreviewType('synth-pop')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    audioPreviewType === 'synth-pop'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Sintesis Pop Modern
                </button>
                <button
                  type="button"
                  onClick={() => setAudioPreviewType('custom-file')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    audioPreviewType === 'custom-file'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Upload File Audio (MP3/WAV)
                </button>
              </div>

              {audioPreviewType === 'custom-file' && (
                <div className="pt-2">
                  <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/20 rounded-xl hover:border-[#FFC857] cursor-pointer bg-white/5 transition-all">
                    <Upload className="w-5 h-5 text-[#FFC857] mb-1" />
                    <span className="text-xs font-medium text-gray-300">
                      {uploadedFileName || 'Pilih atau Seret File Audio (MP3, WAV, M4A)'}
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div>
                <div className="text-xs font-semibold text-white">Tandai sebagai Karya Unggulan (Featured)</div>
                <div className="text-[11px] text-gray-400">Karya ini akan diberi lencana emas dan diprioritaskan di galeri.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC857]"></div>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div>
              {isEditing && initialTrack && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(initialTrack);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Hapus karya ini dari galeri"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Karya</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-bold text-xs shadow-lg shadow-[#FFC857]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Karya'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
