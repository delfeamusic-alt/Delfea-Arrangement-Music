import React, { useState, useEffect } from 'react';
import { Music2, Volume2, VolumeX, Menu, X, Sparkles, Disc, Send, Sliders, ShieldCheck } from 'lucide-react';
import { globalAudioEngine } from '../audio/audioEngine';
import { GenreId } from '../types';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface Props {
  activeGenre: GenreId | null;
  isPlaying: boolean;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<Props> = ({ activeGenre, isPlaying, onOpenConsultation }) => {
  const { settings, openAdmin } = useSiteSettings();
  const { branding } = settings;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMute = () => {
    const muted = globalAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Karya Kami', href: '#karya-kami', badge: 'Diskografi' },
    { label: 'Pameran Genre', href: '#showcase-genre' },
    { label: 'Layanan Kami', href: '#layanan' },
    { label: 'Laboratorium Fusion', href: '#fusion-lab' },
    { label: 'Alur Kerja', href: '#workflow' },
    { label: 'Konsultasi', href: '#kontak' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel shadow-2xl shadow-black/80 py-3 border-b border-white/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a
          href="#hero"
          id="brand-logo"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#A55EEA] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#0D0E12] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              {branding.logoType === 'image' && branding.logoImageUrl ? (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.brandName}
                  className="w-full h-full object-cover rounded-[9px]"
                />
              ) : (
                <Music2 className="w-5 h-5 text-[#FFC857] transition-transform duration-300 group-hover:rotate-6" />
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-[#A55EEA]/20 animate-pulse" />
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-heading font-bold text-lg sm:text-xl text-white tracking-wide">
                {branding.brandName || 'DELFEA'}
              </span>
              {branding.brandBadge && (
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30 font-medium">
                  {branding.brandBadge}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-wider text-gray-400 font-light -mt-0.5">
              {branding.brandTagline || 'ARRANGEMENT MUSIC'}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-gray-300 hover:text-[#FFC857] transition-colors duration-200 relative group py-1 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-[#FFC857]/20 text-[#FFC857] border border-[#FFC857]/40">
                  {link.badge}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#FFC857] to-[#A55EEA] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right CTA & Audio Status & Admin Trigger */}
        <div className="hidden md:flex items-center gap-3">
          {/* Active Audio Pill */}
          {isPlaying && activeGenre ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181A24] border border-[#FFC857]/40 shadow-sm shadow-[#FFC857]/20 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#FFC857] animate-ping" />
              <span className="text-gray-300 font-mono">
                Now Playing: <strong className="text-[#FFC857] uppercase">{activeGenre}</strong>
              </span>
              <button
                type="button"
                onClick={handleToggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="ml-1 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#FFC857]" />}
              </button>
            </div>
          ) : (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              <Disc className="w-3.5 h-3.5 text-gray-400 animate-spin-slow" />
              <span>Studio Engine Ready</span>
            </div>
          )}

          {/* Admin Menu Trigger Button */}
          <button
            type="button"
            id="nav-admin-btn"
            onClick={openAdmin}
            title="Buka Menu Admin & Edit Konten"
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#FFC857] hover:border-[#FFC857]/40 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FFC857]" />
            <span>Admin</span>
          </button>

          {/* Primary CTA */}
          <button
            type="button"
            id="nav-consultation-btn"
            onClick={onOpenConsultation}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#FFC857]/25 hover:shadow-[#FFC857]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#0D0E12]" />
            <span>{settings.hero.btnConsultText || 'Konsultasi Proyek'}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Quick mobile Admin button */}
          <button
            type="button"
            onClick={openAdmin}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#FFC857] text-xs font-semibold flex items-center gap-1"
            title="Menu Admin"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleToggleMute}
              className="p-2 rounded-lg bg-[#181A24] border border-[#FFC857]/30 text-[#FFC857]"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
          <button
            type="button"
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-200 hover:text-[#FFC857]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-6 py-6 mt-3 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-gray-200 hover:text-[#FFC857] py-1 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFC857]/20 text-[#FFC857] border border-[#FFC857]/40">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openAdmin();
              }}
              className="text-left text-sm font-semibold text-[#FFC857] py-2 flex items-center gap-2 border-b border-white/5"
            >
              <Sliders className="w-4 h-4" />
              <span>Buka Menu Admin Studio</span>
            </button>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFC857] to-[#FFAA00] text-[#0D0E12] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FFC857]/30"
            >
              <Send className="w-4 h-4" />
              <span>{settings.hero.btnConsultText || 'Mulai Konsultasi Proyek'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
