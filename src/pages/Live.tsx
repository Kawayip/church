import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, MessageCircle, Share2, RefreshCw, AlertCircle, ExternalLink, Calendar, Eye, Info } from 'lucide-react';
import { useLiveStream } from '../hooks/useLiveStream';
import { formatViewerCount, formatTimeAgo } from '../services/youtube';
import { validateYouTubeConfig } from '../config/youtube';

export const Live: React.FC = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showingRecentStream, setShowingRecentStream] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Check YouTube API configuration
  const configStatus = validateYouTubeConfig();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  const {
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
    sendChatMessage
  } = useLiveStream();

  // Update timestamp when viewer count changes
  React.useEffect(() => {
    if (isLive && viewerCount > 0) {
      setLastUpdateTime(new Date());
    }
  }, [viewerCount, isLive]);

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      await sendChatMessage(chatMessage.trim());
      setChatMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show notification
  const showToast = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: isLive ? 'Live Now: Mt. Olives SDA Church' : 'Mt. Olives SDA Church Live Stream',
      text: isLive ? 'Join us live for worship service!' : 'Check out our latest services and upcoming streams.',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Shared successfully!');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        showToast('Failed to share. Please copy the URL manually.');
      }
    }
  };

  // Fullscreen functionality removed - YouTube embed handles this natively

  // Settings panel functionality removed - YouTube embed handles video controls

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&fs=1&origin=${window.location.origin}`;
  };

  const getYouTubeWatchUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const formatScheduledTime = (scheduledTime: string) => {
    const date = new Date(scheduledTime);
    const now = new Date();
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInHours < 48) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Notification Toast */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {notificationMessage}
        </motion.div>
      )}
      {/* Live Stream Header */}
      <section className={`text-white py-3 sm:py-4 lg:py-6 ${showingRecentStream ? 'bg-gradient-to-r from-blue-600 to-blue-700' : (isLive ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-gray-600 to-gray-700')}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                {showingRecentStream ? (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                ) : isLive ? (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                )}
                <span className="font-semibold text-sm sm:text-base">
                  {showingRecentStream ? 'RECENT' : (isLive ? 'LIVE' : 'OFFLINE')}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">
                {showingRecentStream ? (recentStream?.title || 'Recent Service') : 
                 (isLive ? (currentStream?.title || 'Sabbath Worship Service') : 'Live Stream')}
              </h1>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4">
              {isLive && (
                <div className="hidden sm:flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <Users className="h-4 w-4" />
                    <span className="font-semibold text-sm">{formatViewerCount(viewerCount)}</span>
                    <span className="text-xs opacity-90">watching</span>
                  </div>
                  <div className="text-xs opacity-75">
                    Updated {lastUpdateTime.toLocaleTimeString()}
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={refreshStream}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh stream status"
                >
                  <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="bg-white/20 hover:bg-white/30 p-2 sm:px-3 sm:py-2 rounded-lg transition-colors"
                  title="Share this page"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {!configStatus.valid && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-start space-x-3">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 text-sm sm:text-base">
                  YouTube API Not Configured
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-xs sm:text-sm mb-3">
                  To display live viewer counts and stream information, you need to configure the YouTube API.
                </p>
                <div className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">
                  <p className="font-medium mb-1">Missing configuration:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {configStatus.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3 text-xs text-yellow-600 dark:text-yellow-400">
                  <p>See <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">YOUTUBE_INTEGRATION_SETUP.md</code> for setup instructions.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 text-sm sm:text-base">
                  Live Stream Status Unavailable
                </h3>
                <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm mb-3">
                  {error}
                </p>
                {error.includes('quota exceeded') && (
                  <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    <p className="font-medium mb-2">What this means:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Our YouTube API usage limit has been reached for today</li>
                      <li>Live stream detection and viewer counts are temporarily unavailable</li>
                      <li>You can still watch our services directly on YouTube</li>
                      <li>This will reset automatically at midnight (UTC)</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t border-red-300 dark:border-red-700">
                      <a 
                        href="https://www.youtube.com/@sdamtolivesnaalya" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-medium text-sm"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Watch Live on YouTube</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-black rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-video relative">
                {(isLive && currentStream) || showingRecentStream ? (
                  <iframe
                    src={getYouTubeEmbedUrl(showingRecentStream ? (recentStream?.id || currentStream?.id || '') : (currentStream?.id || ''))}
                    title={showingRecentStream ? (recentStream?.title || currentStream?.title || 'Recent Service') : (currentStream?.title || 'Live Stream')}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img 
                      src={recentStream?.thumbnailUrl || currentStream?.thumbnailUrl || "/images/ui/worship.jpg"}
                      alt="Live Stream"
                      className="w-full h-full object-cover"
                    />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white text-lg font-semibold">Stream Offline</p>
                        <p className="text-gray-300 mb-4">We're not live right now</p>
                        
                        {/* Show upcoming stream info */}
                        {upcomingStreams.length > 0 && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <Calendar className="h-4 w-4 text-white" />
                              <span className="text-white font-medium">Next Live Stream</span>
                            </div>
                            <p className="text-white text-sm mb-2">{upcomingStreams[0].title}</p>
                            <p className="text-gray-300 text-xs">
                              {upcomingStreams[0].scheduledStartTime && 
                                formatScheduledTime(upcomingStreams[0].scheduledStartTime)
                              }
                            </p>
                          </div>
                        )}
                        
                        {/* Show recent stream or current stream link */}
                        {(recentStream || currentStream) && !showingRecentStream && (
                          <button
                            onClick={() => {
                              setShowingRecentStream(true);
                            }}
                            className="inline-flex items-center space-x-2 mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <span>Watch Latest Service</span>
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        
                        {/* Fallback YouTube link when API is unavailable */}
                        {error && error.includes('quota exceeded') && (
                          <div className="mt-4 space-y-3">
                            <a
                              href="https://www.youtube.com/@sdamtolivesnaalya"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Watch Live on YouTube</span>
                            </a>
                            <p className="text-gray-300 text-sm">
                              Direct link to our YouTube channel for live streams
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Stream Status Overlay - Only show essential info */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  {showingRecentStream && (
                    <button 
                      onClick={() => setShowingRecentStream(false)}
                      className="bg-black/70 hover:bg-black/90 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                    >
                      Back to Live
                    </button>
                  )}
                  {isLive && viewerCount > 0 && (
                    <div className="flex items-center space-x-2 bg-black/70 px-3 py-1 rounded-full">
                      <Eye className="h-4 w-4 text-red-400" />
                      <span className="text-white text-sm font-medium">{formatViewerCount(viewerCount)}</span>
                      <span className="text-white text-xs opacity-75">watching</span>
                    </div>
                  )}
                </div>
              </div>

                            {/* Settings Panel Removed - YouTube embed handles video controls */}
            </motion.div>

            {/* Service Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 sm:mt-6 card p-3 sm:p-4 lg:p-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {isLive ? 'Live Service' : 'Service Information'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Title</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {isLive ? (currentStream?.title || 'Sabbath Worship Service') : 
                     (recentStream?.title || 'Sabbath Worship Service')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Channel</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {currentStream?.channelTitle || recentStream?.channelTitle || 'Mt. Olives SDA Church'}
                  </p>
                </div>
                {isLive && currentStream?.actualStartTime && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Started</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {new Date(currentStream.actualStartTime).toLocaleString()}
                    </p>
                  </div>
                )}
                {!isLive && recentStream?.publishedAt && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Last Service</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                      {new Date(recentStream.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Service Time</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">11:00 AM - 12:30 PM EAT</p>
                </div>
              </div>
              {(currentStream?.description || recentStream?.description) && (
                <div className="mt-3 sm:mt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                    {(currentStream?.description || recentStream?.description || '').substring(0, 200)}...
                  </p>
                </div>
              )}
            </motion.div>

            {/* Upcoming Streams */}
            {!isLive && upcomingStreams.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 sm:mt-6 card p-3 sm:p-4 lg:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Upcoming Streams</h2>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingStreams.map((stream) => (
                    <div key={stream.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title}
                        className="w-16 h-10 sm:w-20 sm:h-12 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{stream.title}</h3>
                        {stream.scheduledStartTime && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {formatScheduledTime(stream.scheduledStartTime)}
                          </p>
                        )}
                      </div>
                      <a
                        href={getYouTubeWatchUrl(stream.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs sm:text-sm flex-shrink-0"
                      >
                        Set Reminder
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Live Chat */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  <h3 className="font-semibold text-sm sm:text-base">Live Chat</h3>
                  {chatLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                </div>
              </div>
              
              {chatError && (
                <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <p className="text-red-800 dark:text-red-200 text-xs sm:text-sm">{chatError}</p>
                </div>
              )}
              
              <div className="h-48 sm:h-64 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8">
                    <p className="text-xs sm:text-sm">
                      {isLive ? 'No messages yet. Be the first to say something!' : 'Chat will be available when the stream goes live.'}
                    </p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs sm:text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[120px] sm:max-w-none">
                          {msg.authorName}
                          {msg.superChatDetails && (
                            <span className="ml-1 sm:ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-1 sm:px-2 py-1 rounded">
                              {msg.superChatDetails.amountDisplayString}
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs flex-shrink-0">
                          {formatTimeAgo(msg.publishedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 break-words">{msg.displayMessage}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-slate-700">
                {/* Name input for anonymous users */}
                {!userName && isLive && (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name (optional)"
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 text-xs sm:text-sm"
                    />
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isLive ? "Type your message..." : "Chat disabled when offline"}
                    disabled={!isLive}
                    className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 disabled:opacity-50 text-xs sm:text-sm"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!isLive || !chatMessage.trim()}
                    className="btn-primary px-3 sm:px-4 py-2 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    Send
                  </button>
                </div>
                {isLive && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    You can chat anonymously or enter your name above
                  </p>
                )}
              </div>
            </motion.div>

            {/* Upcoming Services
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Services</h3>
              <div className="space-y-4">
                {upcomingServices.map((service, index) => (
                  <div key={index} className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">{service.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{service.date}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{service.time}</p>
                  </div>
                ))}
              </div>
            </motion.div> */}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card p-3 sm:p-4 lg:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <button className="w-full btn-primary py-2 text-sm sm:text-base">
                  Request Prayer
                </button>
                <button className="w-full btn-accent py-2 text-sm sm:text-base">
                  Give Online
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl dark:from-purple-400 dark:to-pink-400 dark:hover:from-purple-500 dark:hover:to-pink-500 text-sm sm:text-base">
                  Download Bulletin
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};