// YouTube API Integration for Live Streams
// This service handles YouTube live stream detection and chat integration

export interface YouTubeLiveStream {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  scheduledStartTime?: string;
  actualStartTime?: string;
  viewerCount?: number;
  isLive: boolean;
  channelId: string;
  channelTitle: string;
}

export interface YouTubeChatMessage {
  id: string;
  authorName: string;
  authorChannelId?: string;
  message: string;
  publishedAt: string;
  displayMessage: string;
  superChatDetails?: {
    amountDisplayString: string;
    userBadge: string;
  };
}

export interface YouTubeAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class YouTubeAPI {
  private apiKey: string;
  private channelId: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    // You'll need to set these environment variables
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
    this.channelId = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || '';
  }

  // Check if API is properly configured
  private isConfigured(): boolean {
    return !!(this.apiKey && this.channelId);
  }

  // Get live streams from the channel
  async getLiveStreams(): Promise<YouTubeAPIResponse<YouTubeLiveStream[]>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'YouTube API not configured. Please set VITE_YOUTUBE_API_KEY and VITE_YOUTUBE_CHANNEL_ID environment variables.'
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&channelId=${this.channelId}&eventType=live&type=video&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No live streams found'
        };
      }

      // Get additional details for each live stream
      const liveStreams = await Promise.all(
        data.items.map(async (item: any) => {
          const streamDetails = await this.getStreamDetails(item.id.videoId);
          return {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            publishedAt: item.snippet.publishedAt,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            isLive: true,
            ...streamDetails
          };
        })
      );

      return {
        success: true,
        data: liveStreams
      };
    } catch (error) {
      console.error('Error fetching live streams:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch live streams'
      };
    }
  }

  // Get detailed information about a specific stream
  async getStreamDetails(videoId: string): Promise<Partial<YouTubeLiveStream>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=liveStreamingDetails,statistics&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {};
      }

      const video = data.items[0];
      const liveDetails = video.liveStreamingDetails;
      const stats = video.statistics;

      return {
        scheduledStartTime: liveDetails?.scheduledStartTime,
        actualStartTime: liveDetails?.actualStartTime,
        viewerCount: stats?.viewCount ? parseInt(stats.viewCount) : undefined
      };
    } catch (error) {
      console.error('Error fetching stream details:', error);
      return {};
    }
  }

  // Get live chat messages (requires live chat ID)
  async getLiveChatMessages(liveChatId: string, pageToken?: string): Promise<YouTubeAPIResponse<{
    messages: YouTubeChatMessage[];
    nextPageToken?: string;
    pollingIntervalMillis: number;
  }>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'YouTube API not configured'
      };
    }

    try {
      const url = new URL(`${this.baseUrl}/liveChat/messages`);
      url.searchParams.append('part', 'snippet,authorDetails');
      url.searchParams.append('liveChatId', liveChatId);
      url.searchParams.append('key', this.apiKey);
      url.searchParams.append('maxResults', '200');
      
      if (pageToken) {
        url.searchParams.append('pageToken', pageToken);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();

      const messages: YouTubeChatMessage[] = data.items.map((item: any) => ({
        id: item.id,
        authorName: item.authorDetails.displayName,
        authorChannelId: item.authorDetails.channelId,
        message: item.snippet.displayMessage,
        displayMessage: item.snippet.displayMessage,
        publishedAt: item.snippet.publishedAt,
        superChatDetails: item.snippet.superChatDetails ? {
          amountDisplayString: item.snippet.superChatDetails.amountDisplayString,
          userBadge: item.snippet.superChatDetails.userBadge?.badgeType || ''
        } : undefined
      }));

      return {
        success: true,
        data: {
          messages,
          nextPageToken: data.nextPageToken,
          pollingIntervalMillis: data.pollingIntervalMillis || 5000
        }
      };
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch chat messages'
      };
    }
  }

  // Get live chat ID for a video
  async getLiveChatId(videoId: string): Promise<YouTubeAPIResponse<string>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=liveStreamingDetails&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          success: false,
          error: 'Video not found'
        };
      }

      const liveChatId = data.items[0].liveStreamingDetails?.activeLiveChatId;
      
      if (!liveChatId) {
        return {
          success: false,
          error: 'Live chat not available for this video'
        };
      }

      return {
        success: true,
        data: liveChatId
      };
    } catch (error) {
      console.error('Error fetching live chat ID:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch live chat ID'
      };
    }
  }

  // Check if channel is currently live
  async isChannelLive(): Promise<YouTubeAPIResponse<boolean>> {
    const response = await this.getLiveStreams();
    
    if (!response.success) {
      return {
        success: false,
        error: response.error
      };
    }

    return {
      success: true,
      data: response.data && response.data.length > 0
    };
  }

  // Get the most recent live stream
  async getCurrentLiveStream(): Promise<YouTubeAPIResponse<YouTubeLiveStream | null>> {
    const response = await this.getLiveStreams();
    
    if (!response.success) {
      return {
        success: false,
        error: response.error
      };
    }

    return {
      success: true,
      data: response.data && response.data.length > 0 ? response.data[0] : null
    };
  }

  // Get the most recent completed live stream for preview
  async getRecentCompletedStream(): Promise<YouTubeAPIResponse<YouTubeLiveStream | null>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'YouTube API not configured. Please set VITE_YOUTUBE_API_KEY and VITE_YOUTUBE_CHANNEL_ID environment variables.'
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&channelId=${this.channelId}&eventType=completed&type=video&order=date&maxResults=1&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          success: true,
          data: null,
          message: 'No recent completed streams found'
        };
      }

      const item = data.items[0];
      const streamDetails = await this.getStreamDetails(item.id.videoId);
      
      const completedStream: YouTubeLiveStream = {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        publishedAt: item.snippet.publishedAt,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        isLive: false,
        ...streamDetails
      };

      return {
        success: true,
        data: completedStream
      };
    } catch (error) {
      console.error('Error fetching recent completed stream:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent stream'
      };
    }
  }

  // Get upcoming scheduled streams
  async getUpcomingStreams(): Promise<YouTubeAPIResponse<YouTubeLiveStream[]>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'YouTube API not configured. Please set VITE_YOUTUBE_API_KEY and VITE_YOUTUBE_CHANNEL_ID environment variables.'
      };
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&channelId=${this.channelId}&eventType=upcoming&type=video&order=date&maxResults=5&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No upcoming streams found'
        };
      }

      const upcomingStreams = await Promise.all(
        data.items.map(async (item: any) => {
          const streamDetails = await this.getStreamDetails(item.id.videoId);
          return {
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            publishedAt: item.snippet.publishedAt,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            isLive: false,
            ...streamDetails
          };
        })
      );

      return {
        success: true,
        data: upcomingStreams
      };
    } catch (error) {
      console.error('Error fetching upcoming streams:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch upcoming streams'
      };
    }
  }
}

// Create and export a singleton instance
export const youtubeAPI = new YouTubeAPI();

// Helper function to format viewer count
export const formatViewerCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Helper function to format time ago
export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}; 