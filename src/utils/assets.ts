// Static Assets Management
// This file helps organize and manage static images, logos, and other assets

// Logo imports
import churchLogo from '../assets/images/logos/church-logo.png';
import churchLogoDark from '../assets/images/logos/church-logo-dark.png';
import churchIcon from '../assets/images/logos/church-icon.png';

// Team member images (add your actual team photos here)
import defaultAvatar from '../assets/images/ui/default-avatar.png';
import pastorImage from '../assets/images/team/pastor.jpg';
import elderImage from '../assets/images/team/elder.jpg';
import deaconImage from '../assets/images/team/deacon.jpg';

// Asset configuration
export const ASSETS = {
  logos: {
    church: {
      light: churchLogo,
      dark: churchLogoDark,
    },
    icon: churchIcon,
  },
  team: {
    default: defaultAvatar,
    pastor: pastorImage,
    elder: elderImage,
    deacon: deaconImage,
    // Add more team members as needed:
    // staff1: staff1Image,
  },
  icons: {
    // Add custom icons here if needed
  },
  backgrounds: {
    // Add background images here if needed
  },
};

// Helper function to get theme-aware logo
export const getLogo = (theme: 'light' | 'dark') => {
  return theme === 'dark' ? ASSETS.logos.church.dark : ASSETS.logos.church.light;
};

// Helper function to get church icon
export const getChurchIcon = () => {
  return ASSETS.logos.icon;
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