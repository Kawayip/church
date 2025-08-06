// YouTube API Configuration
// This file contains configuration and setup instructions for YouTube integration

export const YOUTUBE_CONFIG = {
  // API Base URL
  API_BASE_URL: 'https://www.googleapis.com/youtube/v3',
  
  // Required environment variables
  REQUIRED_ENV_VARS: [
    'VITE_YOUTUBE_API_KEY',
    'VITE_YOUTUBE_CHANNEL_ID'
  ],
  
  // Polling intervals (in milliseconds)
  POLLING_INTERVALS: {
    STREAM_STATUS: 30000, // 30 seconds
    CHAT_MESSAGES: 5000,  // 5 seconds (will be overridden by YouTube API response)
  },
  
  // YouTube embed parameters
  EMBED_PARAMS: {
    autoplay: 1,
    rel: 0,
    modestbranding: 1,
    controls: 1,
    showinfo: 0,
  }
};

// Setup Instructions:
/*
To set up YouTube integration for your church website:

1. GET YOUTUBE API KEY:
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one
   - Enable YouTube Data API v3
   - Create credentials (API Key)
   - Copy the API key

2. GET CHANNEL ID:
   - Go to your church's YouTube channel
   - Right-click and "View Page Source"
   - Search for "channelId" or look in the URL
   - Channel ID format: UCxxxxxxxxxxxxxxxxxxxxxxxxxx

3. SET ENVIRONMENT VARIABLES:
   Create a .env file in your project root:
   
   VITE_YOUTUBE_API_KEY=your_api_key_here
   VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here

4. API QUOTAS:
   - YouTube Data API v3 has daily quotas
   - Default: 10,000 units per day
   - Each request costs different units:
     * Search: 100 units
     * Videos: 1 unit
     * Live chat: 5 units
   - Monitor usage in Google Cloud Console

5. SECURITY:
   - Restrict API key to your domain
   - Add HTTP referrer restrictions
   - Only enable YouTube Data API v3

6. TESTING:
   - Use the Live page to test integration
   - Check browser console for errors
   - Verify environment variables are loaded

7. DEPLOYMENT:
   - Add environment variables to Railway
   - Ensure API key restrictions allow your domain
   - Monitor API usage in production

Note: Sending chat messages requires OAuth2 authentication
and special permissions that are not available in the
standard API. Users will need to chat directly on YouTube.
*/

// Helper function to validate configuration
export const validateYouTubeConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
    errors.push('VITE_YOUTUBE_API_KEY is not set');
  }
  
  if (!import.meta.env.VITE_YOUTUBE_CHANNEL_ID) {
    errors.push('VITE_YOUTUBE_CHANNEL_ID is not set');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Helper function to build embed URL
export const buildEmbedUrl = (videoId: string, params?: Partial<typeof YOUTUBE_CONFIG.EMBED_PARAMS>) => {
  const urlParams = new URLSearchParams({
    ...YOUTUBE_CONFIG.EMBED_PARAMS,
    ...params
  });
  
  return `https://www.youtube.com/embed/${videoId}?${urlParams.toString()}`;
}; 