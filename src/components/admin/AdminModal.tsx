import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  MessageCircle,
  Music,
  Layers,
  Send,
  FileText,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { AdminLogin } from './AdminLogin';
import { TabBranding } from './TabBranding';
import { TabContactSocial } from './TabContactSocial';
import { TabHero } from './TabHero';
import { TabGenres } from './TabGenres';
import { TabServicesWorkflow } from './TabServicesWorkflow';
import { TabContactCTA } from './TabContactCTA';
import { TabFooter } from './TabFooter';
import { TabBackupSecurity } from './TabBackupSecurity';

type AdminTab = 'branding' | 'contact' | 'hero' | 'genres' | 'services' | 'contactCta' | 'footer' | 'backup';

export const AdminModal: React.FC = () => {
  const { isAdminOpen, closeAdmin, isAdminAuthenticated, logoutAdmin } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<AdminTab>('branding');

  if (!isAdminOpen) return null;

  if (!isAdminAuthenticated) {
    return <AdminLogin onClose={closeAdmin} />;
  }

  const tabList = [
    { id: 'branding' as AdminTab, label: 'Identitas & Logo', icon: Sliders },
    { id: 'contact' as AdminTab, label: 'Kontak & Medsos', icon: MessageCircle },
    { id: 'hero' as AdminTab, label: 'Hero & Beranda', icon: Sparkles },
    { id: 'genres' as AdminTab, label: 'Pameran Genre', icon: Music },
    { id: 'services' as AdminTab, label: 'Layanan & Alur', icon: Layers },
    { id: 'contactCta' as AdminTab, label: 'Kontak & Banner CTA', icon: Send },
    { id: 'footer' as AdminTab, label: 'Teks Footer', icon: FileText },
    { id: 'backup' as AdminTab, label: 'Keamanan & Cadangan', icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in overflow-hidden">
      <div className="glass-card rounded-3xl border border-[#FFC857]/40 w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0A0B0E]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#A55EEA] p-[1.5px]">
              <div className="w-full h-full bg-[#0D0E12] rounded-[10px] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-[#FFC857]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-heading font-bold text-base sm:text-lg text-white">
                  Panel Pengelola Konten & Logo Studio
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Live Auto-Save</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Ubah logo, nomor telepon, kontak, dan seluruh teks fitur pada web ini secara langsung.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFC857] hover:bg-[#FFAA00] text-[#0D0E12] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#FFC857]/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </button>
            <button
              type="button"
              onClick={logoutAdmin}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Kunci / Keluar Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeAdmin}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-4 py-2 bg-[#0D0E12] border-b border-white/10 overflow-x-auto flex items-center gap-1.5 shrink-0 scrollbar-thin">
          {tabList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-[#181A24] text-[#FFC857] border border-[#FFC857]/40 shadow-sm shadow-[#FFC857]/15'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFC857]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#08090C] space-y-6">
          {activeTab === 'branding' && <TabBranding />}
          {activeTab === 'contact' && <TabContactSocial />}
          {activeTab === 'hero' && <TabHero />}
          {activeTab === 'genres' && <TabGenres />}
          {activeTab === 'services' && <TabServicesWorkflow />}
          {activeTab === 'contactCta' && <TabContactCTA />}
          {activeTab === 'footer' && <TabFooter />}
          {activeTab === 'backup' && <TabBackupSecurity />}
        </div>

        {/* Bottom Status Bar */}
        <div className="p-3 border-t border-white/10 bg-[#0D0E12] flex items-center justify-between text-xs text-gray-400 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span>Semua ketikan & perubahan langsung aktif seketika tanpa perlu restart server.</span>
          </div>
          <button
            type="button"
            onClick={closeAdmin}
            className="text-[11px] text-[#FFC857] hover:underline font-semibold"
          >
            Selesai & Tutup Panel ✕
          </button>
        </div>
      </div>
    </div>
  );
};
