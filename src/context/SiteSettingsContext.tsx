import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/defaultSettings';

const STORAGE_KEY = 'delfea_site_settings_v1';
const AUTH_SESSION_KEY = 'delfea_admin_auth_session';

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings> | ((prev: SiteSettings) => SiteSettings)) => void;
  updateSection: <K extends keyof SiteSettings>(sectionKey: K, sectionData: Partial<SiteSettings[K]>) => void;
  resetToDefaults: () => void;
  exportSettingsJSON: () => void;
  importSettingsJSON: (jsonString: string) => { success: boolean; message: string };
  isAdminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPin: (newPin: string) => boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge with DEFAULT_SITE_SETTINGS to ensure any new keys exist
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          branding: { ...DEFAULT_SITE_SETTINGS.branding, ...(parsed.branding || {}) },
          contact: { 
            ...DEFAULT_SITE_SETTINGS.contact, 
            ...(parsed.contact || {}),
            socialLinks: { ...DEFAULT_SITE_SETTINGS.contact.socialLinks, ...(parsed.contact?.socialLinks || {}) }
          },
          hero: { 
            ...DEFAULT_SITE_SETTINGS.hero, 
            ...(parsed.hero || {}),
            trustBadges: parsed.hero?.trustBadges || DEFAULT_SITE_SETTINGS.hero.trustBadges
          },
          genreShowcase: { 
            ...DEFAULT_SITE_SETTINGS.genreShowcase, 
            ...(parsed.genreShowcase || {}),
            genres: parsed.genreShowcase?.genres || DEFAULT_SITE_SETTINGS.genreShowcase.genres
          },
          servicesSection: { 
            ...DEFAULT_SITE_SETTINGS.servicesSection, 
            ...(parsed.servicesSection || {}),
            services: parsed.servicesSection?.services || DEFAULT_SITE_SETTINGS.servicesSection.services,
            workflowSteps: parsed.servicesSection?.workflowSteps || DEFAULT_SITE_SETTINGS.servicesSection.workflowSteps
          },
          catalogSection: { ...DEFAULT_SITE_SETTINGS.catalogSection, ...(parsed.catalogSection || {}) },
          contactSection: { ...DEFAULT_SITE_SETTINGS.contactSection, ...(parsed.contactSection || {}) },
          footer: { ...DEFAULT_SITE_SETTINGS.footer, ...(parsed.footer || {}) },
        };
      }
    } catch (e) {
      console.warn('Failed to load saved settings from localStorage, using default:', e);
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Save changes to localStorage whenever settings state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage:', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<SiteSettings> | ((prev: SiteSettings) => SiteSettings)) => {
    setSettings((prev) => {
      if (typeof newSettings === 'function') {
        return newSettings(prev);
      }
      return {
        ...prev,
        ...newSettings,
      };
    });
  };

  const updateSection = <K extends keyof SiteSettings>(sectionKey: K, sectionData: Partial<SiteSettings[K]>) => {
    setSettings((prev) => {
      const currentSection = prev[sectionKey];
      if (typeof currentSection === 'object' && currentSection !== null && !Array.isArray(currentSection)) {
        return {
          ...prev,
          [sectionKey]: {
            ...currentSection,
            ...sectionData,
          },
        };
      }
      return {
        ...prev,
        [sectionKey]: sectionData,
      };
    });
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Error resetting localStorage settings:', e);
    }
  };

  const exportSettingsJSON = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `delfea_studio_settings_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const importSettingsJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Format file JSON tidak valid.' };
      }
      setSettings((prev) => ({
        ...prev,
        ...parsed,
      }));
      return { success: true, message: 'Pengaturan web berhasil diimpor!' };
    } catch (e) {
      return { success: false, message: `Gagal membaca file JSON: ${(e as Error).message}` };
    }
  };

  const openAdmin = () => {
    setIsAdminOpen(true);
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
  };

  const loginAdmin = (pin: string): boolean => {
    const validPin = settings.adminPin || '1234';
    if (pin.trim() === validPin) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {}
  };

  const changeAdminPin = (newPin: string): boolean => {
    if (!newPin || newPin.trim().length < 3) return false;
    setSettings((prev) => ({
      ...prev,
      adminPin: newPin.trim(),
    }));
    return true;
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSection,
        resetToDefaults,
        exportSettingsJSON,
        importSettingsJSON,
        isAdminOpen,
        openAdmin,
        closeAdmin,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
