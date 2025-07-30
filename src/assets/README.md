# Asset Management Guide

This directory contains static assets for the church website. These are images, logos, and other files that don't change frequently and are bundled with the application.

## 📁 Folder Structure

```
src/assets/
├── images/
│   ├── logos/          # Church logos, favicons
│   ├── team/           # Staff photos, team member images
│   ├── icons/          # Custom icons, symbols
│   ├── backgrounds/    # Background images, patterns
│   └── ui/            # UI elements, placeholders
└── fonts/             # Custom fonts (if any)
```

## 🎯 Usage Guidelines

### Static Assets (Use this folder for):
- ✅ Church logos and branding
- ✅ Team member photos
- ✅ Custom icons and symbols
- ✅ Background images and patterns
- ✅ UI placeholders and defaults
- ✅ Favicon and app icons

### Dynamic Content (Use database BLOBs for):
- ❌ Event photos
- ❌ Sermon thumbnails
- ❌ Gallery images
- ❌ News article images
- ❌ Ministry photos
- ❌ Resource files

## 🔧 How to Use

### 1. Adding New Static Assets

1. Place your file in the appropriate folder
2. Import it in your component or add it to `src/utils/assets.ts`
3. Use the helper functions for theme-aware assets

### 2. Example Usage

```tsx
import { getLogo, getTeamImage } from '../utils/assets';

// Theme-aware logo
const logo = getLogo(theme);

// Team member image with fallback
const memberImage = getTeamImage('pastor');

// Direct import for specific assets
import myImage from '../assets/images/team/pastor.jpg';
```

### 3. File Formats

- **Logos**: PNG (recommended for logos)
- **Photos**: JPG or WebP
- **Icons**: SVG (preferred) or PNG
- **Backgrounds**: JPG, WebP, or SVG

## 📏 Recommended Sizes

- **Logos**: 200x60px (PNG format)
- **Team Photos**: 400x400px (square)
- **Icons**: 24x24px or 32x32px
- **Backgrounds**: 1920x1080px max
- **UI Elements**: As needed, but optimize for web

## 🎨 Theme Support

Some assets support both light and dark themes:
- `church-logo.png` - Light theme version (teal #3f7f8c)
- `church-logo-dark.png` - Dark theme version (emerald #10b981)

Use the `getLogo(theme)` helper function to automatically switch between them.

## 🏛️ Church Icon

- `church-icon.png` - Universal church icon used throughout the site and as favicon
- Size: 512x512px (square)
- Color: Teal #3f7f8c for consistency
- Use `getChurchIcon()` helper function to access it

## 📝 Adding Team Members

1. Add the photo to `src/assets/images/team/`
2. Import it in `src/utils/assets.ts`
3. Add it to the `ASSETS.team` object
4. Use `getTeamImage('memberId')` in your components

## 🔄 Version Control

- ✅ Static assets are version controlled
- ✅ Changes require code deployment
- ✅ Good for branding and core assets
- ❌ Not suitable for frequently changing content

## 🚀 Performance

- Assets are bundled and optimized during build
- No additional network requests needed
- Faster loading for core assets
- Better caching strategy 