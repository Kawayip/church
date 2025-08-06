# YouTube Live Stream Integration Setup

This guide will help you set up automatic YouTube live stream detection and chat integration for your church website.

## Features

✅ **Automatic Live Stream Detection**: Automatically detects when your church goes live on YouTube  
✅ **Real-time Chat Integration**: Pulls live chat messages from YouTube  
✅ **Viewer Count Display**: Shows real-time viewer count  
✅ **Embedded Video Player**: Displays the live stream directly on your website  
✅ **Auto-refresh**: Continuously updates stream status and chat  

## Prerequisites

1. A YouTube channel for your church
2. Google Cloud Console account
3. YouTube Data API v3 enabled

## Step-by-Step Setup

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
2. Right-click and select "View Page Source"
3. Search for `"channelId"` in the source code
4. Copy the channel ID (format: `UCxxxxxxxxxxxxxxxxxxxxxxxxxx`)

Alternatively:
- Look at your channel URL: `https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxxxxxxxxxxxx`
- The part after `/channel/` is your channel ID

### 3. Set Environment Variables

Create a `.env` file in your project root:

```env
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here
```

### 4. Configure API Key Security

1. Go back to Google Cloud Console > Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain(s):
   - `localhost:5173/*` (for development)
   - `your-domain.railway.app/*` (for production)
5. Under "API restrictions", select "Restrict key"
6. Select only "YouTube Data API v3"

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Go to the Live page: `http://localhost:5173/live`
3. Check the browser console for any errors
4. If your church is live on YouTube, you should see the stream embedded

## How It Works

### Live Stream Detection
- The system polls YouTube API every 30 seconds
- Checks if your channel has any active live streams
- Automatically updates the UI when a stream goes live/offline

### Chat Integration
- When a stream is live, fetches chat messages every 5 seconds
- Displays real-time chat messages from YouTube
- Shows user names, messages, and timestamps
- Supports Super Chat messages (donations)

### Video Player
- Embeds the YouTube live stream directly on your website
- Maintains YouTube's branding and controls
- Automatically starts playing when live

## API Quotas and Limits

YouTube Data API v3 has daily quotas:
- **Default**: 10,000 units per day
- **Search requests**: 100 units each
- **Video details**: 1 unit each
- **Live chat**: 5 units each

**Estimated daily usage**:
- Stream status check (every 30s): ~2,880 units
- Chat messages (every 5s when live): ~17,280 units per hour of live streaming

**Recommendations**:
- Monitor usage in Google Cloud Console
- Consider increasing quota if needed
- Implement caching for production

## Troubleshooting

### Common Issues

1. **"YouTube API not configured" error**
   - Check that environment variables are set correctly
   - Restart your development server after adding `.env` file

2. **"API key not valid" error**
   - Verify API key is correct
   - Check that YouTube Data API v3 is enabled
   - Ensure API key restrictions allow your domain

3. **"Channel not found" error**
   - Verify channel ID is correct
   - Check that the channel is public

4. **Chat not loading**
   - Live chat requires the stream to be active
   - Some streams may have chat disabled
   - Check browser console for specific errors

### Debug Mode

Add this to your browser console to debug:

```javascript
// Check if environment variables are loaded
console.log('API Key:', import.meta.env.VITE_YOUTUBE_API_KEY ? 'Set' : 'Not set');
console.log('Channel ID:', import.meta.env.VITE_YOUTUBE_CHANNEL_ID ? 'Set' : 'Not set');

// Test API directly
fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${import.meta.env.VITE_YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`)
  .then(r => r.json())
  .then(console.log);
```

## Production Deployment

### Railway Deployment

1. Add environment variables to Railway:
   - Go to your Railway project
   - Navigate to "Variables" tab
   - Add:
     - `VITE_YOUTUBE_API_KEY`
     - `VITE_YOUTUBE_CHANNEL_ID`

2. Update API key restrictions:
   - Add your Railway domain to allowed referrers
   - Format: `*.railway.app/*`

3. Monitor API usage:
   - Check Google Cloud Console regularly
   - Set up alerts for quota usage

### Security Best Practices

1. **Restrict API Key**: Only allow your domain
2. **Monitor Usage**: Set up alerts for unusual activity
3. **Rotate Keys**: Consider rotating API keys periodically
4. **HTTPS Only**: Ensure your site uses HTTPS in production

## Customization

### Styling
The live stream page uses Tailwind CSS classes. You can customize:
- Colors in `src/pages/Live.tsx`
- Layout in the component structure
- Animations using Framer Motion

### Polling Intervals
Adjust polling frequency in `src/config/youtube.ts`:
```typescript
POLLING_INTERVALS: {
  STREAM_STATUS: 30000, // 30 seconds
  CHAT_MESSAGES: 5000,  // 5 seconds
}
```

### Chat Features
- Modify chat display in `src/pages/Live.tsx`
- Add message filtering
- Implement user authentication for chat

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify API key and channel ID
3. Check browser console for errors
4. Monitor API usage in Google Cloud Console

## Future Enhancements

Potential improvements:
- [ ] OAuth2 authentication for sending chat messages
- [ ] Scheduled stream notifications
- [ ] Chat moderation features
- [ ] Stream recording integration
- [ ] Multi-language support
- [ ] Mobile app integration 