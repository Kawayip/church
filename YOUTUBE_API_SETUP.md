# YouTube API Setup Guide

This guide will help you set up YouTube API integration for your church's live streaming functionality.

## The Problem

If you're seeing a "YouTube API error: 403" or "quota exceeded" error, it means:

1. **Missing API Credentials**: The YouTube API key and channel ID are not configured
2. **Quota Exceeded**: You've reached the daily API usage limit
3. **Permission Issues**: The API key doesn't have the correct permissions

## Quick Fix

### Step 1: Create Environment File

Create a `.env` file in your project root with these variables:

```env
# YouTube API Configuration
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here

# Other existing variables...
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=larachurch
DB_PORT=3306
```

### Step 2: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key and add it to your `.env` file

### Step 3: Get Your Channel ID

**Method 1: From YouTube Studio**
1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Go to **Settings** → **Channel** → **Basic info**
3. Copy the Channel ID (starts with `UC`)

**Method 2: From Channel URL**
1. Go to your YouTube channel
2. Look at the URL - if it shows `/channel/UCxxxxx`, that's your Channel ID
3. If it shows `/c/yourname` or `/user/yourname`, view page source and search for "channelId"

### Step 4: Configure API Key Restrictions (Recommended)

1. In Google Cloud Console, go to your API key
2. Click **Edit**
3. Under **Application restrictions**, select **HTTP referrers**
4. Add your domains:
   - `https://yourdomain.com/*`
   - `https://www.yourdomain.com/*`
   - `http://localhost:*` (for development)

## Understanding API Quotas

### Default Quotas
- **Daily quota**: 10,000 units per day
- **Resets**: Every day at midnight Pacific Time

### API Call Costs
- **Search requests**: 100 units each
- **Video details**: 1 unit each  
- **Live chat messages**: 5 units each

### Your App's Usage
With the current implementation, your app uses approximately:
- **Live stream check**: ~101 units (search + video details)
- **Recent streams**: ~100 units
- **Upcoming streams**: ~100 units
- **Chat messages**: ~5 units per poll

**Total per page load**: ~300+ units
**With auto-refresh every 60 seconds**: ~7,200+ units per hour

## Optimizations Made

To reduce quota usage, we've implemented:

1. **Reduced polling frequency**:
   - Stream status: 60 seconds (was 30)
   - Viewer count: 30 seconds (was 10)
   - Chat messages: 5 seconds (unchanged)

2. **Better error handling**:
   - Graceful fallback when quota exceeded
   - Clear error messages for users
   - Direct YouTube links when API unavailable

3. **Smart API calls**:
   - Skip additional calls when quota exceeded
   - Cache results when possible

## Monitoring Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Dashboard**
4. Click on **YouTube Data API v3**
5. View your quota usage and remaining quota

## Increasing Quotas

If you need higher quotas:

1. Go to **APIs & Services** → **Quotas**
2. Find **YouTube Data API v3**
3. Request quota increase (requires justification)
4. Google typically approves reasonable requests for legitimate use

## Alternative Solutions

### Option 1: Manual Stream Embedding
Instead of auto-detection, manually embed your stream:

```tsx
// In your Live.tsx component
const MANUAL_STREAM_ID = "your_video_id_here"; // Update when going live
const embedUrl = `https://www.youtube.com/embed/${MANUAL_STREAM_ID}?autoplay=1&rel=0`;
```

### Option 2: Webhook Integration
Set up YouTube webhooks to notify your server when you go live (more complex but quota-free).

### Option 3: Scheduled Streams
Use YouTube's scheduled streaming feature and hardcode the schedule in your app.

## Testing Your Setup

1. Add your API credentials to `.env`
2. Restart your development server
3. Go to `/live` page
4. Check browser console for any errors
5. Verify the YouTube API configuration status

## Troubleshooting

### "API key not found"
- Check that `VITE_YOUTUBE_API_KEY` is set in `.env`
- Restart your development server after adding environment variables

### "Channel not found"
- Verify your `VITE_YOUTUBE_CHANNEL_ID` is correct
- Make sure it starts with `UC` and is 24 characters long

### "Access forbidden"
- Check your API key restrictions
- Make sure YouTube Data API v3 is enabled
- Verify your domain is in the allowed referrers

### Still getting quota errors
- Check your usage in Google Cloud Console
- Consider the optimizations mentioned above
- Request quota increase if needed

## Security Best Practices

1. **Restrict your API key** to specific domains
2. **Don't commit** your `.env` file to version control
3. **Regenerate keys** if they're ever exposed
4. **Monitor usage** regularly for unexpected spikes
5. **Use environment variables** for all sensitive data

## Production Deployment

When deploying to production:

1. Add environment variables to your hosting platform
2. Update API key restrictions to include production domain
3. Monitor quota usage in production
4. Set up alerts for quota approaching limits

---

## Support

If you continue to have issues:

1. Check the browser console for detailed error messages
2. Verify your API key has the correct permissions
3. Test with a simple API call using a tool like Postman
4. Contact Google Cloud Support for quota-related issues
