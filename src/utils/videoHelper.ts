export interface VideoSourceInfo {
  isEmbed: boolean;
  type: 'youtube' | 'facebook' | 'tiktok' | 'native';
  url: string;
}

/**
 * Parses any user-submitted video link and returns the optimized source
 * along with rendering instructions (iframe embed vs native HTML5 video player)
 */
export function parseVideoUrl(url: string | null | undefined): VideoSourceInfo {
  const defaultVideos = [
    "https://assets.mixkit.co/videos/preview/mixkit-watering-plants-in-a-greenhouse-with-hose-42043-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-organic-soil-with-a-growing-small-plant-48895-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-carrying-a-box-full-of-fresh-vegetables-48902-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-greenhouse-worker-working-with-plants-41619-large.mp4"
  ];

  if (!url) {
    return { isEmbed: false, type: 'native', url: defaultVideos[0] };
  }

  const urlLower = url.toLowerCase();

  // 1. YouTube Matches (watch?v=, shorts/, youtu.be/, embed/)
  // Supports formats:
  // - https://www.youtube.com/watch?v=aqz-KE-9B3M
  // - https://youtu.be/aqz-KE-9B3M
  // - https://youtube.com/shorts/aqz-KE-9B3M
  const ytRegex = /(?:(?:[a-zA-Z0-9\-]+\.)?youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|(?:[a-zA-Z0-9\-]+\.)?youtube\.com\/shorts\/)([^"&?\/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return {
      isEmbed: true,
      type: 'youtube',
      url: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`
    };
  }

  // 2. Facebook Matches
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.watch") || urlLower.includes("fb.com")) {
    return {
      isEmbed: true,
      type: 'facebook',
      url: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&mute=1`
    };
  }

  // 3. TikTok Matches (direct video or short link)
  const tiktokIdRegex = /\/video\/(\d+)/;
  const tiktokMatch = url.match(tiktokIdRegex);
  if (tiktokMatch) {
    const videoId = tiktokMatch[1];
    return {
      isEmbed: true,
      type: 'tiktok',
      url: `https://www.tiktok.com/embed/v2/${videoId}`
    };
  } else if (urlLower.includes("tiktok.com")) {
    // If we only have the share URL e.g. vm.tiktok.com, try to parse it
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
    return {
      isEmbed: true,
      type: 'tiktok',
      url: `https://www.tiktok.com/embed/v2/${lastPart}`
    };
  }

  // 4. Native files (direct MP4/WebM streams or blob files)
  if (urlLower.match(/\.(mp4|webm|ogg)/) || urlLower.startsWith("blob:") || urlLower.includes("mixkit.co")) {
    return {
      isEmbed: false,
      type: 'native',
      url: url
    };
  }

  // Fallback: stable selection from default high-quality loops based on the string hash
  const sum = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const chosenUrl = defaultVideos[sum % defaultVideos.length];
  return {
    isEmbed: false,
    type: 'native',
    url: chosenUrl
  };
}
