import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Plus,
  Pencil,
  Trash2,
  Search,
  Filter,
  Sparkles,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Disc,
  Play,
  Pause,
  ExternalLink,
  Volume2,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Clock,
  Calendar,
  Radio,
  RefreshCw,
  Maximize2,
  Minimize2,
  X,
  Tv,
} from 'lucide-react';
import { PortfolioTrack, GenreId } from '../types';
import { INITIAL_PORTFOLIO_TRACKS } from '../data/mockData';
import { globalAudioEngine } from '../audio/audioEngine';
import { WaveformVisualizer } from './WaveformVisualizer';
import { TrackEditModal } from './TrackEditModal';
import { YouTubeModalPlayer } from './YouTubeModalPlayer';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../utils/mediaHelper';

interface Props {
  onOpenConsultation: (trackContext?: string) => void;
  activeGenre: GenreId | null;
  isPlayingGlobal: boolean;
  onTogglePlayGlobal: (genre: GenreId) => void;
}

const STORAGE_KEY = 'delfea_music_portfolio_v1';

export const MusicCatalogSection: React.FC<Props> = ({
  onOpenConsultation,
  activeGenre,
  isPlayingGlobal,
  onTogglePlayGlobal,
}) => {
  const [tracks, setTracks] = useState<PortfolioTrack[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load tracks from localStorage', e);
    }
    return INITIAL_PORTFOLIO_TRACKS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState('all');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'featured' | 'title'>('newest');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<PortfolioTrack | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<PortfolioTrack | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Inline Video in card column
  const [activeInlineVideoTrackId, setActiveInlineVideoTrackId] = useState<string | null>(null);
  // Expanded card tracking (mode lebarkan)
  const [expandedTrackIds, setExpandedTrackIds] = useState<Set<string>>(new Set());

  // Active YouTube video modal (optional popup view)
  const [activeYouTubeVideo, setActiveYouTubeVideo] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    artist?: string;
  } | null>(null);

  // Custom audio playback for custom uploaded tracks
  const [playingCustomTrackId, setPlayingCustomTrackId] = useState<string | null>(null);
  const customAudioRef = useRef<HTMLAudioElement | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.warn('Failed to save tracks to localStorage', e);
    }
  }, [tracks]);

  // Toast auto hide
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Genre list for filter tabs
  const allGenres = ['all', ...Array.from(new Set(tracks.map((t) => t.genre)))];

  // Handler for adding/updating track
  const handleSaveTrack = (track: PortfolioTrack) => {
    setTracks((prev) => {
      const existsIndex = prev.findIndex((t) => t.id === track.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = track;
        showToast(`Karya "${track.title}" berhasil diperbarui!`);
        return updated;
      } else {
        showToast(`Karya baru "${track.title}" berhasil ditambahkan!`);
        return [track, ...prev];
      }
    });
  };

  // Handler for deleting track
  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    setTracks((prev) => prev.filter((t) => t.id !== deleteCandidate.id));
    showToast(`Karya "${deleteCandidate.title}" telah dihapus.`);
    if (playingCustomTrackId === deleteCandidate.id) {
      customAudioRef.current?.pause();
      setPlayingCustomTrackId(null);
    }
    if (activeInlineVideoTrackId === deleteCandidate.id) {
      setActiveInlineVideoTrackId(null);
    }
    setDeleteCandidate(null);
  };

  // Reset to initial
  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan daftar lagu ke contoh awal studio Delfea?')) {
      setTracks(INITIAL_PORTFOLIO_TRACKS);
      setActiveInlineVideoTrackId(null);
      showToast('Katalog karya telah di-reset ke data bawaan.');
    }
  };

  // Unified Play Handler for portfolio tracks:
  // 1. If track has YouTube link: Toggle inline video right in this column & stop default background synth!
  // 2. If track has custom MP3/WAV: Play custom audio & stop default synth!
  // 3. Otherwise: Play synth demo matching the genre.
  const handlePlayTrack = (track: PortfolioTrack) => {
    // If track has YouTube video link
    if (track.links?.youtube) {
      if (activeInlineVideoTrackId === track.id) {
        // Toggle close
        setActiveInlineVideoTrackId(null);
      } else {
        // Pause any background synthesizer to prevent default voice playing!
        globalAudioEngine.stop();
        if (customAudioRef.current) {
          customAudioRef.current.pause();
          setPlayingCustomTrackId(null);
        }
        setActiveInlineVideoTrackId(track.id);
        showToast(`Memutar video YouTube "${track.title}" di kolom...`);
      }
      return;
    }

    // If custom audio file uploaded
    if (track.audioPreviewType === 'custom-file' && track.customAudioUrl) {
      if (activeInlineVideoTrackId) {
        setActiveInlineVideoTrackId(null);
      }
      globalAudioEngine.stop();

      if (playingCustomTrackId === track.id) {
        customAudioRef.current?.pause();
        setPlayingCustomTrackId(null);
      } else {
        if (customAudioRef.current) {
          customAudioRef.current.pause();
        }
        const audio = new Audio(track.customAudioUrl);
        customAudioRef.current = audio;
        audio.play().catch((e) => console.warn(e));
        audio.onended = () => setPlayingCustomTrackId(null);
        setPlayingCustomTrackId(track.id);
      }
      return;
    }

    // Otherwise use synthesizer preview based on type (for demo-only tracks)
    if (activeInlineVideoTrackId) {
      setActiveInlineVideoTrackId(null);
    }
    if (customAudioRef.current) {
      customAudioRef.current.pause();
      setPlayingCustomTrackId(null);
    }

    let genreTarget: GenreId = 'fusion';
    if (track.audioPreviewType === 'synth-jazz') genreTarget = 'jazz';
    else if (track.audioPreviewType === 'synth-bossanova') genreTarget = 'bossanova';
    else if (track.audioPreviewType === 'synth-pop') genreTarget = 'pop';
    else if (track.audioPreviewType === 'synth-dangdut') genreTarget = 'dangdut';
    else if (track.audioPreviewType === 'synth-gamelan') genreTarget = 'gamelan';
    else genreTarget = 'fusion';

    onTogglePlayGlobal(genreTarget);
  };

  // Toggle expand / shrink video card in the column
  const handleToggleExpandTrack = (trackId: string) => {
    setExpandedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
        showToast('Tampilan kolom video diubah ke ukuran standar.');
      } else {
        next.add(trackId);
        showToast('Tampilan kolom video dilebarkan (Mode Luas).');
      }
      return next;
    });
  };

  // Check if track is actively playing
  const isTrackPlaying = (track: PortfolioTrack) => {
    if (activeInlineVideoTrackId === track.id) return true;
    if (playingCustomTrackId === track.id) return true;
    if (!isPlayingGlobal) return false;

    if (track.audioPreviewType === 'synth-jazz' && activeGenre === 'jazz') return true;
    if (track.audioPreviewType === 'synth-bossanova' && activeGenre === 'bossanova') return true;
    if (track.audioPreviewType === 'synth-pop' && activeGenre === 'pop') return true;
    if (track.audioPreviewType === 'synth-dangdut' && activeGenre === 'dangdut') return true;
    if (track.audioPreviewType === 'synth-gamelan' && activeGenre === 'gamelan') return true;
    if (track.audioPreviewType === 'synth-fusion' && activeGenre === 'fusion') return true;
    return false;
  };

  const handleOpenYouTubeVideoModal = (track: PortfolioTrack) => {
    if (!track.links?.youtube) return;
    setActiveYouTubeVideo({
      isOpen: true,
      url: track.links.youtube,
      title: track.title,
      artist: track.artist,
    });
  };

  // Share track
  const handleShareTrack = (track: PortfolioTrack) => {
    const text = `Dengarkan karya aransemen "${track.title}" oleh ${track.artist} di Delfea Studio!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} - Kunjungi: ${window.location.origin}#karya-kami`);
      showToast('Tautan dan deskripsi karya disalin ke clipboard!');
    }
  };

  // Filtered & Sorted Tracks
  const filteredTracks = tracks.filter((track) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchTitle = track.title.toLowerCase().includes(q);
      const matchArtist = track.artist.toLowerCase().includes(q);
      const matchGenre = track.genre.toLowerCase().includes(q);
      const matchTags = track.tags?.some((t) => t.toLowerCase().includes(q));
      const matchInstruments = track.instrumentation?.some((i) => i.toLowerCase().includes(q));
      if (!matchTitle && !matchArtist && !matchGenre && !matchTags && !matchInstruments) {
        return false;
      }
    }

    // Genre filter
    if (selectedGenreFilter !== 'all' && track.genre !== selectedGenreFilter) {
      return false;
    }

    // Platform filter
    if (selectedPlatformFilter) {
      if (selectedPlatformFilter === 'youtube' && !track.links?.youtube) return false;
      if (selectedPlatformFilter === 'tiktok' && !track.links?.tiktok) return false;
      if (selectedPlatformFilter === 'instagram' && !track.links?.instagram) return false;
      if (selectedPlatformFilter === 'x' && !track.links?.x) return false;
      if (selectedPlatformFilter === 'facebook' && !track.links?.facebook) return false;
      if (selectedPlatformFilter === 'spotify' && !track.links?.spotify) return false;
    }

    return true;
  });

  // Sorting
  filteredTracks.sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default newest
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <section id="karya-kami" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-24">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-[#FFC857]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[600px] h-[600px] bg-[#A55EEA]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC857]/10 border border-[#FFC857]/30 text-xs font-semibold text-[#FFC857] tracking-wider uppercase">
              <Disc className="w-3.5 h-3.5" />
              <span>Katalog & Diskografi Musik Studio</span>
            </div>
            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Karya Musik yang Telah Kami Buat
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Jelajahi portofolio aransemen lintas genre resmi produksi Delfea Studio. Anda dapat mengelola karya, menambahkan trek baru, memperbarui informasi, dan menautkan link YouTube, TikTok, Instagram, X, Facebook, atau Spotify.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              type="button"
              id="btn-add-track"
              onClick={() => {
                setEditingTrack(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFC857] via-[#FFB703] to-[#FFAA00] text-[#0D0E12] font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-[#FFC857]/25 hover:shadow-[#FFC857]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#0D0E12]" />
              <span>Tambah Musik Baru</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              title="Reset data ke contoh awal"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 shadow-xl mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul lagu, artis, instrumen, atau tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-xs sm:text-sm text-white placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Platform Filter Buttons */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              <span className="text-xs text-gray-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Platform:
              </span>
              {[
                { id: null, label: 'Semua' },
                { id: 'youtube', icon: Youtube, color: 'text-red-400 hover:text-red-300' },
                { id: 'tiktok', icon: Sparkles, color: 'text-cyan-300 hover:text-cyan-200' },
                { id: 'instagram', icon: Instagram, color: 'text-pink-400 hover:text-pink-300' },
                { id: 'x', icon: Twitter, color: 'text-gray-300 hover:text-white' },
                { id: 'facebook', icon: Facebook, color: 'text-blue-400 hover:text-blue-300' },
                { id: 'spotify', icon: Radio, color: 'text-emerald-400 hover:text-emerald-300' },
              ].map((p) => {
                const isSelected = selectedPlatformFilter === p.id;
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id || 'all'}
                    type="button"
                    onClick={() => setSelectedPlatformFilter(p.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-[#FFC857]/20 border-[#FFC857] text-[#FFC857]'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-3 h-3" />}
                    <span>{p.label || ''}</span>
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <span className="text-xs text-gray-400 shrink-0">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#12141A] border border-white/10 focus:border-[#FFC857] focus:outline-none text-xs text-white"
              >
                <option value="newest">Terbaru Rilis</option>
                <option value="featured">Karya Unggulan</option>
                <option value="title">Judul (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Genre Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-white/5 no-scrollbar">
            {allGenres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenreFilter(g)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all border ${
                  selectedGenreFilter === g
                    ? 'bg-gradient-to-r from-[#FFC857]/20 to-[#A55EEA]/20 border-[#FFC857] text-[#FFC857]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {g === 'all' ? '✨ Semua Genre' : g}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
            {filteredTracks.map((track) => {
              const active = isTrackPlaying(track);
              const isInlineVideoActive = activeInlineVideoTrackId === track.id && !!track.links?.youtube;
              const isExpanded = expandedTrackIds.has(track.id);
              const ytId = extractYouTubeId(track.links?.youtube);
              const ytThumb = ytId ? getYouTubeThumbnailUrl(track.links?.youtube) : null;
              const embedUrl = track.links?.youtube ? getYouTubeEmbedUrl(track.links.youtube) : null;

              return (
                <div
                  key={track.id}
                  id={`track-card-${track.id}`}
                  className={`group relative rounded-2xl glass-panel border border-white/10 hover:border-[#FFC857]/50 transition-all duration-500 flex flex-col justify-between overflow-hidden ${
                    isExpanded
                      ? 'col-span-1 md:col-span-2 lg:col-span-3 ring-2 ring-[#FFC857]/40 shadow-2xl shadow-[#FFC857]/15 bg-[#12141A]/95'
                      : 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FFC857]/10'
                  }`}
                >
                  {/* TOP MEDIA AREA: INLINE YOUTUBE VIDEO OR VINYL ARTWORK COVER */}
                  {isInlineVideoActive && embedUrl ? (
                    <div className="relative w-full bg-black border-b border-white/10 flex flex-col transition-all duration-300">
                      {/* Video Player Header Bar & Size Controls */}
                      <div className="px-4 py-2.5 bg-[#0D0E12]/90 backdrop-blur-md flex items-center justify-between gap-2 border-b border-white/10">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                          </span>
                          <span className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate">{track.title}</span>
                          </span>
                          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                            {isExpanded ? 'Mode Lebar (Luas)' : 'Mode Standar'}
                          </span>
                        </div>

                        {/* Controls: Edit / Hapus / Lebarkan / Kecilkan / Buka / Tutup */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Edit in video mode */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTrack(track);
                              setIsModalOpen(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#FFC857]/20 hover:bg-[#FFC857]/30 border border-[#FFC857]/40 text-[#FFC857] text-xs font-semibold flex items-center gap-1 transition-all"
                            title="Edit informasi dan link musik ini"
                          >
                            <Pencil className="w-3 h-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          {/* Delete in video mode */}
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(track)}
                            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-all"
                            title="Hapus karya ini dari galeri"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Hapus</span>
                          </button>

                          {/* Toggle Lebarkan / Kecilkan */}
                          <button
                            type="button"
                            onClick={() => handleToggleExpandTrack(track.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                              isExpanded
                                ? 'bg-[#FFC857] text-[#0D0E12] shadow-md hover:bg-[#FFC857]/90'
                                : 'bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white'
                            }`}
                            title={isExpanded ? 'Kecilkan ke Ukuran Kolom Standar' : 'Lebarkan Tampilan Video di Grid'}
                          >
                            {isExpanded ? (
                              <>
                                <Minimize2 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">Kecilkan (Standar)</span>
                              </>
                            ) : (
                              <>
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">Lebarkan</span>
                              </>
                            )}
                          </button>

                          {/* Open in YouTube in new tab */}
                          <a
                            href={track.links?.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                            title="Buka di Website YouTube"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Close Video button */}
                          <button
                            type="button"
                            onClick={() => setActiveInlineVideoTrackId(null)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white transition-colors"
                            title="Tutup Video (Kembali ke Cover)"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* YouTube Embedded iFrame */}
                      <div
                        className={`w-full relative bg-black flex items-center justify-center transition-all duration-500 ${
                          isExpanded
                            ? 'aspect-video max-h-[500px] sm:min-h-[380px] md:min-h-[440px]'
                            : 'aspect-video min-h-[200px] sm:min-h-[220px] max-h-[260px]'
                        }`}
                      >
                        <iframe
                          src={embedUrl}
                          title={`YouTube video player - ${track.title}`}
                          className="w-full h-full object-cover"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>

                      {/* Direct YouTube link helper strip */}
                      <div className="bg-[#181A22] px-4 py-2 flex items-center justify-between border-t border-white/10 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1.5 text-xs text-gray-300">
                          <Youtube className="w-3.5 h-3.5 text-red-500 fill-current" />
                          <span>Video YouTube</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={track.links?.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FFC857] hover:underline flex items-center gap-1 font-medium"
                          >
                            <span>Buka di Aplikasi YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Vinyl Artwork Cover View */
                    <div
                      onClick={() => handlePlayTrack(track)}
                      className={`relative h-44 w-full bg-gradient-to-br ${track.coverGradient} p-5 flex items-end justify-between overflow-hidden transition-all duration-300 cursor-pointer group/cover`}
                      title="Klik untuk memutar lagu / video karya ini"
                    >
                      {/* YouTube Thumbnail Background if available */}
                      {ytThumb && (
                        <img
                          src={ytThumb}
                          alt={track.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-35 transition-opacity duration-500 scale-105 group-hover:scale-100 pointer-events-none"
                        />
                      )}

                      {/* Dark overlay with noise */}
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1.5px]" />

                      {/* Top Right Quick Edit & Delete Floating Action Bar */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-lg">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTrack(track);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FFC857]/20 hover:bg-[#FFC857]/35 border border-[#FFC857]/50 text-[#FFC857] text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-sm"
                          title="Edit judul, artis, link YouTube, & rincian karya"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteCandidate(track);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-red-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-sm"
                          title="Hapus karya musik ini dari katalog"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>

                      {/* Rotating Vinyl Mockup Effect */}
                      <div
                        className={`absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#0D0E12] border-4 border-gray-800 shadow-2xl flex items-center justify-center transition-transform duration-1000 ${
                          active ? 'animate-spin-slow' : 'group-hover:rotate-45'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFC857] to-[#A55EEA] p-0.5">
                          <div className="w-full h-full bg-[#0D0E12] rounded-full flex items-center justify-center">
                            <Music className="w-4 h-4 text-[#FFC857]" />
                          </div>
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="relative z-10 flex flex-col gap-1.5">
                        <div className="flex items-center flex-wrap gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20">
                            {track.genre}
                          </span>
                          {track.isFeatured && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFC857] text-[#0D0E12] shadow-sm flex items-center gap-1 font-sans">
                              <Sparkles className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          {track.links?.youtube && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/90 text-white shadow-sm flex items-center gap-1 border border-red-400/40">
                              <Youtube className="w-2.5 h-2.5 fill-current" /> Video Klip
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-300 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#FFC857]" /> {track.releaseYear}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#FFC857]" /> {track.duration}
                          </span>
                          {track.bpm && (
                            <>
                              <span>•</span>
                              <span>{track.bpm} BPM</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Unified Top Play Button (Matches YouTube / Custom Master / Demo) */}
                      <button
                        type="button"
                        onClick={() => handlePlayTrack(track)}
                        className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          active
                            ? 'bg-[#FFC857] text-[#0D0E12] scale-105 shadow-[#FFC857]/40 ring-4 ring-[#FFC857]/20'
                            : track.links?.youtube
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 ring-2 ring-red-400/30'
                            : 'bg-white/20 hover:bg-[#FFC857] text-white hover:text-[#0D0E12] backdrop-blur-md'
                        }`}
                        title={
                          active
                            ? 'Hentikan / Tutup Pemutar'
                            : track.links?.youtube
                            ? 'Putar Video YouTube di Kolom Ini'
                            : track.audioPreviewType === 'custom-file'
                            ? 'Putar Master Audio'
                            : 'Dengarkan Demo Aransemen'
                        }
                        aria-label={active ? 'Pause' : 'Play'}
                      >
                        {active ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : track.links?.youtube ? (
                          <div className="flex items-center justify-center">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Active Dynamic Waveform / Status Bar */}
                  {active && (
                    <div className="bg-[#12141A] px-5 py-2 border-b border-[#FFC857]/30 flex items-center justify-between">
                      <span className="text-[10px] text-[#FFC857] font-mono animate-pulse flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFC857]" />
                        {isInlineVideoActive
                          ? '● Video YouTube Sedang Diputar di Kolom'
                          : playingCustomTrackId === track.id
                          ? '● Memutar Master Audio Asli'
                          : '● Memutar Studio Demo Preview'}
                      </span>
                      <div className="w-28">
                        <WaveformVisualizer
                          isPlaying={true}
                          accentColor={isInlineVideoActive ? 'red' : 'gold'}
                          barCount={16}
                          height={18}
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Title & Artist */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#FFC857] transition-colors leading-snug">
                            {track.title}
                          </h3>
                          <p className="text-xs text-[#A55EEA] font-medium mt-0.5">
                            {track.artist}
                          </p>
                        </div>

                        {/* Size toggle badge when expanded */}
                        {isExpanded && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFC857]/20 border border-[#FFC857]/40 text-[#FFC857] font-semibold shrink-0">
                            Kolom Lebar
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className={`text-xs text-gray-400 mt-2.5 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {track.description}
                      </p>

                      {/* Instrumentation Tags */}
                      {track.instrumentation && track.instrumentation.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {track.instrumentation.map((inst, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300"
                            >
                              {inst}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Highlighted YouTube Video Action Box with Inline Player and Expand Buttons */}
                      {track.links?.youtube && (
                        <div className="mt-3.5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0 shadow-md text-white">
                              <Youtube className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-white truncate">
                                Video Klip Musik di YouTube
                              </div>
                              <div className="text-[10px] text-red-300 truncate">
                                {isInlineVideoActive
                                  ? (isExpanded ? 'Sedang tayang (Mode Lebar)' : 'Sedang tayang di kolom')
                                  : 'Tersedia diputar langsung di kolom ini'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center flex-wrap gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                            {/* Putar / Tutup Button */}
                            <button
                              type="button"
                              onClick={() => handlePlayTrack(track)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                                isInlineVideoActive
                                  ? 'bg-white/20 hover:bg-white/30 text-white'
                                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 hover:scale-105 active:scale-95'
                              }`}
                              title={isInlineVideoActive ? 'Tutup Video' : 'Putar Video YouTube Langsung di Kolom'}
                            >
                              {isInlineVideoActive ? (
                                <>
                                  <X className="w-3 h-3" />
                                  <span>Tutup</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Putar di Kolom</span>
                                </>
                              )}
                            </button>

                            {/* Tombol Lebarkan / Kecilkan */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!isInlineVideoActive) {
                                  handlePlayTrack(track);
                                }
                                handleToggleExpandTrack(track.id);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 border transition-all ${
                                isExpanded
                                  ? 'bg-[#FFC857]/20 border-[#FFC857] text-[#FFC857]'
                                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-gray-300 hover:text-white'
                              }`}
                              title={isExpanded ? 'Kecilkan ke Ukuran Standar' : 'Lebarkan Ukuran Video'}
                            >
                              {isExpanded ? (
                                <>
                                  <Minimize2 className="w-3 h-3" />
                                  <span>Kecilkan</span>
                                </>
                              ) : (
                                <>
                                  <Maximize2 className="w-3 h-3" />
                                  <span>Lebarkan</span>
                                </>
                              )}
                            </button>

                            {/* Link Eksternal */}
                            <a
                              href={track.links.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                              title="Buka Langsung di YouTube"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Social Media & Platform Links Section */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Tersedia di Platform:</span>
                      </div>

                      {/* Platform Badges Row */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        {track.links?.youtube && (
                          <button
                            type="button"
                            onClick={() => handlePlayTrack(track)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all group/btn ${
                              isInlineVideoActive
                                ? 'bg-red-600 text-white border-red-500 shadow-sm'
                                : 'bg-red-500/15 hover:bg-red-500/25 border-red-500/35 text-red-400 hover:text-red-300'
                            }`}
                            title="Putar Video YouTube di Kolom Ini"
                          >
                            <Youtube className="w-3.5 h-3.5" />
                            <span>YouTube</span>
                            {isInlineVideoActive ? (
                              <Pause className="w-2.5 h-2.5 fill-current ml-0.5" />
                            ) : (
                              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                            )}
                          </button>
                        )}

                        {track.links?.tiktok && (
                          <a
                            href={track.links.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-[11px] font-medium transition-all group/btn"
                            title="Dengarkan di TikTok"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>TikTok</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                          </a>
                        )}

                        {track.links?.instagram && (
                          <a
                            href={track.links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:text-pink-300 text-[11px] font-medium transition-all group/btn"
                            title="Buka di Instagram Reels / Post"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                            <span>Instagram</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                          </a>
                        )}

                        {track.links?.x && (
                          <a
                            href={track.links.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 text-gray-200 hover:text-white text-[11px] font-medium transition-all group/btn"
                            title="Lihat di X.com (Twitter)"
                          >
                            <Twitter className="w-3.5 h-3.5" />
                            <span>X.com</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                          </a>
                        )}

                        {track.links?.facebook && (
                          <a
                            href={track.links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 text-[11px] font-medium transition-all group/btn"
                            title="Tonton di Facebook"
                          >
                            <Facebook className="w-3.5 h-3.5" />
                            <span>Facebook</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                          </a>
                        )}

                        {track.links?.spotify && (
                          <a
                            href={track.links.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-[11px] font-medium transition-all group/btn"
                            title="Dengarkan di Spotify"
                          >
                            <Radio className="w-3.5 h-3.5" />
                            <span>Spotify</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                          </a>
                        )}

                        {/* If no links added */}
                        {!track.links?.youtube &&
                          !track.links?.tiktok &&
                          !track.links?.instagram &&
                          !track.links?.x &&
                          !track.links?.facebook &&
                          !track.links?.spotify && (
                            <span className="text-[11px] text-gray-500 italic">
                              Link platform belum disematkan.
                            </span>
                          )}
                      </div>

                      {/* Card Bottom Actions: Edit, Delete, Share, Order Similar */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3.5 border-t border-white/10">
                        {/* Action Buttons: Edit, Delete, Share */}
                        <div className="flex items-center flex-wrap gap-2">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTrack(track);
                              setIsModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#FFC857]/15 hover:bg-[#FFC857]/25 border border-[#FFC857]/40 text-[#FFC857] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                            title="Edit judul lagu, artis, link YouTube / medsos, atau audio"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit Musik</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(track)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-400 hover:text-red-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                            title="Hapus karya musik ini dari galeri"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>

                          {/* Share Button */}
                          <button
                            type="button"
                            onClick={() => handleShareTrack(track)}
                            className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-[#A55EEA]/20 border border-white/10 hover:border-[#A55EEA]/40 text-gray-300 hover:text-[#A55EEA] text-xs font-medium flex items-center gap-1.5 transition-all"
                            title="Salin Tautan Musik"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline">Bagikan</span>
                          </button>
                        </div>

                        {/* Order similar arrangement */}
                        <button
                          type="button"
                          onClick={() => onOpenConsultation(`Aransemen seperti "${track.title}" (${track.genre})`)}
                          className="text-[11px] font-semibold text-[#FFC857] hover:underline flex items-center justify-end gap-1 shrink-0"
                        >
                          <span>Pesan Aransemen Ini</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-panel rounded-2xl p-10 text-center border border-white/10 max-w-lg mx-auto space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC857]/10 border border-[#FFC857]/20 flex items-center justify-center mx-auto text-[#FFC857]">
              <Music className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {tracks.length === 0 ? 'Daftar Karya Musik Belum Ada' : 'Tidak Ada Karya yang Cocok dengan Filter'}
              </h3>
              <p className="text-xs text-gray-400">
                {tracks.length === 0
                  ? 'Katalog musik Anda saat ini belum memiliki lagu. Anda dapat memulihkan contoh lagu bawaan atau menambah lagu baru.'
                  : 'Cobalah mengatur ulang pencarian, memilih kategori genre lain, atau mereset platform filter.'}
              </p>
            </div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              {tracks.length === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setTracks(INITIAL_PORTFOLIO_TRACKS);
                    showToast('5 Karya musik bawaan studio telah dipulihkan!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] text-xs font-bold shadow-lg shadow-[#FFC857]/30 hover:scale-105 transition-all"
                >
                  ✨ Pulihkan 5 Lagu Bawaan Studio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenreFilter('all');
                    setSelectedPlatformFilter(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/10 transition-all"
                >
                  Tampilkan Semua Musik (Reset Filter)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingTrack(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#181A24] hover:bg-[#202230] border border-white/20 text-xs text-[#FFC857] font-bold transition-all"
              >
                + Tambah Musik Baru
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Track Modal */}
      <TrackEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrack(null);
        }}
        onSave={handleSaveTrack}
        onDelete={(track) => setDeleteCandidate(track)}
        initialTrack={editingTrack}
      />

      {/* YouTube Embedded Video Player Modal */}
      {activeYouTubeVideo && (
        <YouTubeModalPlayer
          isOpen={activeYouTubeVideo.isOpen}
          onClose={() => setActiveYouTubeVideo(null)}
          videoUrl={activeYouTubeVideo.url}
          trackTitle={activeYouTubeVideo.title}
          artist={activeYouTubeVideo.artist}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md glass-panel rounded-2xl border border-red-500/40 p-6 text-white shadow-2xl shadow-black">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-white mb-2">
              Hapus Karya Musik Ini?
            </h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus{' '}
              <strong className="text-white">"{deleteCandidate.title}"</strong> dari katalog diskografi studio? Tindakan ini dapat dibatalkan melalui tombol reset.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-lg shadow-red-500/30"
              >
                Ya, Hapus Karya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="glass-panel px-4 py-3 rounded-xl border border-[#FFC857]/40 shadow-2xl shadow-black flex items-center gap-3 text-xs text-white">
            <CheckCircle2 className="w-4 h-4 text-[#FFC857] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </section>
  );
};
