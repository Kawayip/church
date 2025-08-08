# YouTube Live Viewer Count Setup Guide

## Quick Setup for Live Viewer Counts

To enable live viewer counts on your church website, follow these steps:

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

### 2. Get Your YouTube Channel ID

1. Go to your church's YouTube channel
2. Look at the URL: `https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Copy the channel ID (the part after `/channel/`)

### 3. Set Environment Variables

Create a `.env` file in your project root (same folder as `package.json`):

```env
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here
```

**Example:**
```env
VITE_YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Restart Your Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

### 5. Test the Integration

1. Go to the Live page on your website
2. If your church is live on YouTube, you should see:
   - Live viewer count in the header
   - Viewer count in the video player controls
   - Real-time updates every 10 seconds

### 6. Security Setup (Recommended)

1. Go back to Google Cloud Console > Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain(s):
   - `localhost:5173/*` (for development)
   - `your-domain.com/*` (for production)
5. Under "API restrictions", select "Restrict key"
6. Select only "YouTube Data API v3"

## Features Enabled

Once configured, you'll have:

✅ **Real-time viewer count** - Updates every 10 seconds when live  
✅ **Live stream detection** - Automatically detects when you go live  
✅ **Embedded video player** - Shows your YouTube stream directly on your website  
✅ **Live chat integration** - Displays YouTube chat messages  
✅ **Stream information** - Shows title, description, and timing  

## Troubleshooting

- **"YouTube API not configured"**: Check that your `.env` file is in the correct location
- **"API key not valid"**: Verify your API key and ensure YouTube Data API v3 is enabled
- **No viewer count showing**: Make sure you're currently live on YouTube

## API Usage

The YouTube Data API has daily quotas:
- Default: 10,000 units per day
- Each viewer count update: ~1 unit
- Estimated daily usage: ~8,640 units for continuous live streaming

Monitor usage in Google Cloud Console and increase quota if needed.

## Support

If you need help:
1. Check the detailed setup guide: `YOUTUBE_INTEGRATION_SETUP.md`
2. Verify your API key and channel ID
3. Check browser console for specific errors
