import { useState, useEffect, useCallback, useRef } from 'react';
import { youtubeAPI, YouTubeLiveStream, YouTubeChatMessage, formatViewerCount, formatTimeAgo } from '../services/youtube';

export interface UseLiveStreamReturn {
  // Live stream state
  isLive: boolean;
  currentStream: YouTubeLiveStream | null;
  viewerCount: number;
  loading: boolean;
  error: string | null;
  
  // Offline state
  recentStream: YouTubeLiveStream | null;
  upcomingStreams: YouTubeLiveStream[];
  
  // Chat state
  chatMessages: YouTubeChatMessage[];
  chatLoading: boolean;
  chatError: string | null;
  
  // Actions
  refreshStream: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
}

export const useLiveStream = (autoRefresh = true): UseLiveStreamReturn => {
  // Live stream state
  const [isLive, setIsLive] = useState(false);
  const [currentStream, setCurrentStream] = useState<YouTubeLiveStream | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Offline state
  const [recentStream, setRecentStream] = useState<YouTubeLiveStream | null>(null);
  const [upcomingStreams, setUpcomingStreams] = useState<YouTubeLiveStream[]>([]);

  // Chat state
  const [chatMessages, setChatMessages] = useState<YouTubeChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Refs for managing intervals
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const liveChatIdRef = useRef<string | null>(null);
  const nextPageTokenRef = useRef<string | undefined>(undefined);

  // Fetch current live stream
  const fetchCurrentStream = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await youtubeAPI.getCurrentLiveStream();
      
      if (response.success) {
        if (response.data) {
          setIsLive(true);
          setCurrentStream(response.data);
          setViewerCount(response.data.viewerCount || 0);
          
          // If we have a new stream, reset chat
          if (liveChatIdRef.current !== response.data.id) {
            liveChatIdRef.current = response.data.id;
            setChatMessages([]);
            nextPageTokenRef.current = undefined;
            
            // Get live chat ID for this stream
            const chatIdResponse = await youtubeAPI.getLiveChatId(response.data.id);
            if (chatIdResponse.success && chatIdResponse.data) {
              liveChatIdRef.current = chatIdResponse.data;
            }
          }
        } else {
          setIsLive(false);
          setCurrentStream(null);
          setViewerCount(0);
          setChatMessages([]);
          liveChatIdRef.current = null;
          nextPageTokenRef.current = undefined;
          
          // Fetch recent completed stream and upcoming streams when not live
          await fetchOfflineContent();
        }
      } else {
        setError(response.error || 'Failed to fetch live stream');
        setIsLive(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch offline content (recent and upcoming streams)
  const fetchOfflineContent = useCallback(async () => {
    try {
      // Fetch recent completed stream
      const recentResponse = await youtubeAPI.getRecentCompletedStream();
      if (recentResponse.success) {
        setRecentStream(recentResponse.data || null);
      }

      // Fetch upcoming streams
      const upcomingResponse = await youtubeAPI.getUpcomingStreams();
      if (upcomingResponse.success) {
        setUpcomingStreams(upcomingResponse.data || []);
      }
    } catch (err) {
      console.error('Error fetching offline content:', err);
    }
  }, []);

  // Fetch chat messages
  const fetchChatMessages = useCallback(async () => {
    if (!liveChatIdRef.current) return;

    try {
      setChatLoading(true);
      setChatError(null);

      const response = await youtubeAPI.getLiveChatMessages(
        liveChatIdRef.current,
        nextPageTokenRef.current
      );

      if (response.success && response.data) {
        const { messages, nextPageToken, pollingIntervalMillis } = response.data;
        
        // Add new messages to the chat
        setChatMessages(prev => {
          const existingIds = new Set(prev.map(msg => msg.id));
          const newMessages = messages.filter(msg => !existingIds.has(msg.id));
          return [...prev, ...newMessages].slice(-100); // Keep last 100 messages
        });

        nextPageTokenRef.current = nextPageToken;

        // Set up polling interval for chat
        if (chatIntervalRef.current) {
          clearInterval(chatIntervalRef.current);
        }
        
        chatIntervalRef.current = setInterval(() => {
          fetchChatMessages();
        }, pollingIntervalMillis || 5000);
      } else {
        setChatError(response.error || 'Failed to fetch chat messages');
      }
    } catch (err) {
      setChatError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setChatLoading(false);
    }
  }, []);

  // Send chat message (placeholder - would need YouTube API permissions)
  const sendChatMessage = useCallback(async (message: string) => {
    // Note: Sending messages requires YouTube API permissions that are not available
    // in the standard API. This would require OAuth2 authentication and special permissions.
    console.log('Chat message would be sent:', message);
    
    // For now, we'll just add it to the local chat as a mock
    const mockMessage: YouTubeChatMessage = {
      id: `mock-${Date.now()}`,
      authorName: 'You',
      message,
      displayMessage: message,
      publishedAt: new Date().toISOString(),
    };
    
    setChatMessages(prev => [...prev, mockMessage]);
  }, []);

  // Refresh stream manually
  const refreshStream = useCallback(async () => {
    await fetchCurrentStream();
  }, [fetchCurrentStream]);

  // Set up auto-refresh for live stream status
  useEffect(() => {
    if (autoRefresh) {
      // Initial fetch
      fetchCurrentStream();

      // Set up polling interval
      streamIntervalRef.current = setInterval(() => {
        fetchCurrentStream();
      }, 30000); // Check every 30 seconds

      return () => {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, fetchCurrentStream]);

  // Fetch offline content on initial load if not live
  useEffect(() => {
    if (!isLive && !loading) {
      fetchOfflineContent();
    }
  }, [isLive, loading, fetchOfflineContent]);

  // Set up chat polling when live
  useEffect(() => {
    if (isLive && liveChatIdRef.current) {
      fetchChatMessages();
    } else {
      // Clear chat interval when not live
      if (chatIntervalRef.current) {
        clearInterval(chatIntervalRef.current);
        chatIntervalRef.current = null;
      }
    }

    return () => {
      if (chatIntervalRef.current) {
        clearInterval(chatIntervalRef.current);
      }
    };
  }, [isLive, fetchChatMessages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (chatIntervalRef.current) {
        clearInterval(chatIntervalRef.current);
      }
    };
  }, []);

  return {
    isLive,
    currentStream,
    viewerCount,
    loading,
    error,
    recentStream,
    upcomingStreams,
    chatMessages,
    chatLoading,
    chatError,
    refreshStream,
    sendChatMessage,
  };
}; 