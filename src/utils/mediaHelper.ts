/**
 * Helper utilities for parsing, normalizing, and extracting metadata
 * from social media and video streaming links (YouTube, TikTok, Instagram, X, etc.)
 */

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // If user pasted an iframe embed code
  const iframeMatch = cleanUrl.match(/src=["'](?:https?:)?\/\/www\.youtube\.com\/embed\/([^"'\s?&]+)/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }

  // Handle youtu.be/ID
  const shortMatch = cleanUrl.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Handle youtube.com/watch?v=ID or youtube.com/embed/ID or youtube.com/shorts/ID or youtube.com/v/ID
  const longMatch = cleanUrl.match(/(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)([a-zA-Z0-9_-]{11})/i);
  if (longMatch && longMatch[1]) {
    return longMatch[1];
  }

  // Generic 11 char ID check if raw ID was entered
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

export function getYouTubeEmbedUrl(url?: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

export function getYouTubeThumbnailUrl(url?: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function normalizeSocialUrl(url?: string, platform?: string): string {
  if (!url) return '';
  let clean = url.trim();
  if (!clean) return '';

  // If user pasted iframe, extract src
  const srcMatch = clean.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    clean = srcMatch[1];
  }

  // If URL doesn't start with http:// or https://, prepend https://
  if (!/^https?:\/\//i.test(clean)) {
    // If user just typed a username or path, prefix with standard platform domain
    if (platform === 'youtube' && !clean.includes('youtube') && !clean.includes('youtu.be')) {
      if (clean.startsWith('@')) {
        clean = `https://youtube.com/${clean}`;
      } else if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
        clean = `https://www.youtube.com/watch?v=${clean}`;
      } else {
        clean = `https://${clean}`;
      }
    } else if (platform === 'tiktok' && !clean.includes('tiktok.com')) {
      clean = `https://www.tiktok.com/${clean.startsWith('@') ? clean : '@' + clean}`;
    } else if (platform === 'instagram' && !clean.includes('instagram.com')) {
      clean = `https://www.instagram.com/${clean.replace(/^@/, '')}`;
    } else if (platform === 'x' && !clean.includes('x.com') && !clean.includes('twitter.com')) {
      clean = `https://x.com/${clean.replace(/^@/, '')}`;
    } else if (platform === 'facebook' && !clean.includes('facebook.com') && !clean.includes('fb.watch')) {
      clean = `https://www.facebook.com/${clean}`;
    } else if (platform === 'spotify' && !clean.includes('spotify.com')) {
      clean = `https://open.spotify.com/${clean}`;
    } else {
      clean = `https://${clean}`;
    }
  }

  return clean;
}
