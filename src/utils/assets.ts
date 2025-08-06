// Static Assets Management
// This file helps organize and manage static images, logos, and other assets
// Updated to use public folder URLs for production compatibility

// Asset configuration with public URLs
export const ASSETS = {
  logos: {
    church: {
      light: '/images/logos/church-logo.png',
      dark: '/images/logos/church-logo-dark.png',
    },
    icon: '/images/logos/church-icon.png',
  },
  team: {
    default: '/images/ui/default-avatar.png',
    pastor: '/images/team/pastor.jpg',
    elder: '/images/team/elder.jpg',
    deacon: '/images/team/deacon.jpg',
    // Add more team members as needed:
    // staff1: '/images/team/staff1.jpg',
  },
  icons: {
    // Add custom icons here if needed
  },
  backgrounds: {
    // Add background images here if needed
    hero1: '/images/hero/hero-bg-1.jpg',
    hero2: '/images/hero/hero-bg-2.jpg',
    hero3: '/images/hero/hero-bg-3.jpg',
  },
  ui: {
    adults: '/images/ui/adults.jpg',
    ambassadors: '/images/ui/ambassadors.jpg',
    children: '/images/ui/children.jpg',
    fellowship: '/images/ui/fellowship.jpg',
    outreach: '/images/ui/outreach.jpg',
    sabbathschool: '/images/ui/sabbathschool.jpg',
    sabbathschool1: '/images/ui/sabbathschool1.jpg',
    worship: '/images/ui/worship.jpg',
    youth: '/images/ui/youth.jpg',
  },
};

// Helper function to get theme-aware logo
export const getLogo = (theme: 'light' | 'dark') => {
  return theme === 'dark' ? ASSETS.logos.church.dark : ASSETS.logos.church.light;
};

// Helper function to get church icon
export const getChurchIcon = () => {
  // Try the main icon first, fallback to logo if needed
  return ASSETS.logos.icon;
};

// Helper function to get church icon with fallback
export const getChurchIconWithFallback = () => {
  // Return the light logo as a fallback if the icon is too large
  return ASSETS.logos.church.light;
};

// Helper function to get team member image
export const getTeamImage = (memberId: string) => {
  return ASSETS.team[memberId as keyof typeof ASSETS.team] || ASSETS.team.default;
};

// Helper function to get asset with fallback
export const getAsset = (path: string, fallback?: string) => {
  try {
    return path || fallback || ASSETS.team.default;
  } catch {
    return fallback || ASSETS.team.default;
  }
};

// Helper function to get UI image
export const getUIImage = (imageId: string) => {
  return ASSETS.ui[imageId as keyof typeof ASSETS.ui] || ASSETS.team.default;
};

// Helper function to get background image
export const getBackgroundImage = (imageId: string) => {
  return ASSETS.backgrounds[imageId as keyof typeof ASSETS.backgrounds] || ASSETS.backgrounds.hero1;
}; 