import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { GenreShowcase } from './components/GenreShowcase';
import { MusicCatalogSection } from './components/MusicCatalogSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { AudioMasterBar } from './components/AudioMasterBar';
import { Footer } from './components/Footer';
import { globalAudioEngine } from './audio/audioEngine';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GenreId } from './types';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminModal } from './components/admin/AdminModal';

function AppContent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeGenre, setActiveGenre] = useState<GenreId | null>('jazz');
  const [preselectedGenre, setPreselectedGenre] = useState<string>('jazz');
  const [preselectedService, setPreselectedService] = useState<string>('custom-arrangement');

  useEffect(() => {
    const unsubscribe = globalAudioEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      if (state.genre) {
        setActiveGenre(state.genre);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = useCallback((genre: GenreId) => {
    setActiveGenre(genre);
    globalAudioEngine.togglePlay(genre);
  }, []);

  const handleSelectGenreForOrder = useCallback((genre: GenreId) => {
    setPreselectedGenre(genre);
    const formEl = document.getElementById('order-form-container');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectService = useCallback((serviceId: string) => {
    setPreselectedService(serviceId);
    const formEl = document.getElementById('order-form-container');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleOpenConsultation = useCallback((contextNote?: string) => {
    const formEl = document.getElementById('kontak');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0E12] text-[#E5E7EB] relative selection:bg-[#FFC857]/30 selection:text-[#FFC857]">
      {/* Navigation Bar */}
      <Navbar
        activeGenre={activeGenre}
        isPlaying={isPlaying}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Main Content */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          activeGenre={activeGenre}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onOpenConsultation={handleOpenConsultation}
        />

        {/* 2. Genre Showcase */}
        <GenreShowcase
          activeGenre={activeGenre}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onSelectForOrder={handleSelectGenreForOrder}
        />

        {/* 3. Katalog Musik yang Telah Kami Buat (CRUD & Social Media Links) */}
        <MusicCatalogSection
          onOpenConsultation={handleOpenConsultation}
          activeGenre={activeGenre}
          isPlayingGlobal={isPlaying}
          onTogglePlayGlobal={handleTogglePlay}
        />

        {/* 4. Layanan Kami & Fusion Lab */}
        <ServicesSection
          onSelectService={handleSelectService}
          onPreviewFusionAudio={handleTogglePlay}
          activeGenre={activeGenre}
          isPlaying={isPlaying}
        />

        {/* 5. CTA & Formulir Kontak */}
        <ContactSection
          preselectedGenre={preselectedGenre}
          preselectedService={preselectedService}
        />
      </main>

      {/* Master Floating Audio Dock */}
      <AudioMasterBar
        activeGenre={activeGenre}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Studio Footer */}
      <Footer />

      {/* Admin CMS Modal */}
      <AdminModal />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SiteSettingsProvider>
        <AppContent />
      </SiteSettingsProvider>
    </ErrorBoundary>
  );
}

