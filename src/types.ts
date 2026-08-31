export type GenreId = 'jazz' | 'bossanova' | 'pop' | 'dangdut' | 'gamelan' | 'fusion';

export interface GenreCardData {
  id: GenreId;
  name: string;
  subtitle: string;
  iconType: string;
  sampleTrackTitle: string;
  sampleTrackSubtitle: string;
  description: string;
  instrumentation: string[];
  bpm: number;
  musicalKey: string;
  accentColor: 'gold' | 'purple';
  glowColor: string;
  highlightTag: string;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  currentGenreId: GenreId | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export interface ServiceItemData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  deliverables: string[];
  icon: string;
  accentTag: string;
}

export interface ProjectInquiry {
  fullName: string;
  contactMethod: 'whatsapp' | 'email';
  contactValue: string;
  primaryGenre: GenreId | string;
  fusionWithGenre?: string;
  conceptNotes: string;
  projectPackage: 'arrangement' | 'full_production' | 'fusion_cross' | 'custom';
  budgetTier?: string;
  demoFileName?: string;
  demoFileSize?: number;
  demoFileBlobUrl?: string;
}

export interface SocialPlatformLinks {
  youtube?: string;
  tiktok?: string;
  instagram?: string;
  x?: string;
  facebook?: string;
  spotify?: string;
  soundcloud?: string;
}

export interface PortfolioTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  releaseYear: string;
  duration: string;
  description: string;
  instrumentation: string[];
  tags: string[];
  coverGradient: string;
  audioPreviewType: 'synth-jazz' | 'synth-bossanova' | 'synth-pop' | 'synth-dangdut' | 'synth-gamelan' | 'synth-fusion' | 'custom-url' | 'custom-file';
  customAudioUrl?: string;
  links: SocialPlatformLinks;
  isFeatured?: boolean;
  bpm?: number;
  createdAt: string;
}

export interface FusionCombination {
  genreA: string;
  genreB: string;
  title: string;
  description: string;
  signatureElements: string[];
  bpmRange: string;
  demoTrackId: GenreId;
}

export interface TrustBadgeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: 'Sliders' | 'Flame' | 'ShieldCheck' | 'Sparkles' | 'Disc' | 'Music';
}

export interface WorkflowStepItem {
  step: string;
  title: string;
  description: string;
}

export interface SiteSettings {
  branding: {
    brandName: string;
    brandTagline: string;
    brandBadge: string;
    logoType: 'icon' | 'image';
    logoImageUrl: string;
    logoIcon: string;
    brandAccent: 'gold' | 'purple' | 'cyan' | 'red';
  };
  contact: {
    whatsappNumber: string;
    whatsappRaw: string;
    email: string;
    location: string;
    studioStatus: string;
    socialLinks: SocialPlatformLinks;
  };
  hero: {
    badgeText: string;
    badgeSubtext: string;
    headlinePart1: string;
    headlinePart2Highlight: string;
    subheadline: string;
    btnCatalogText: string;
    btnGenreText: string;
    btnConsultText: string;
    trustBadges: TrustBadgeItem[];
  };
  genreShowcase: {
    badge: string;
    title: string;
    description: string;
    genres: GenreCardData[];
  };
  servicesSection: {
    badge: string;
    title: string;
    description: string;
    services: ServiceItemData[];
    fusionLabBadge: string;
    fusionLabTitle: string;
    fusionLabDesc: string;
    workflowBadge: string;
    workflowTitle: string;
    workflowSteps: WorkflowStepItem[];
  };
  catalogSection: {
    badge: string;
    title: string;
    description: string;
  };
  contactSection: {
    bannerBadge: string;
    bannerTitle: string;
    bannerDescription: string;
    bannerButtonText: string;
    formTitle: string;
    formDescription: string;
    whatsappGreetingTemplate: string;
  };
  footer: {
    description: string;
    copyrightText: string;
    slogan: string;
  };
  adminPin: string;
}
