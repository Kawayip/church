import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, MessageCircle, Share2, Volume2, Maximize, Settings, RefreshCw, AlertCircle, ExternalLink, Calendar, Clock, Eye } from 'lucide-react';
import { useLiveStream } from '../hooks/useLiveStream';
import { formatViewerCount, formatTimeAgo } from '../services/youtube';

export const Live: React.FC = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showingRecentStream, setShowingRecentStream] = useState(false);
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

  const upcomingServices = [
    { title: 'Sabbath Worship Service', date: 'Saturday, Jan 4', time: '11:00 AM' },
    { title: 'Prayer Meeting', date: 'Wednesday, Jan 8', time: '7:00 PM' },
    { title: 'Youth Sabbath', date: 'Saturday, Jan 11', time: '11:00 AM' },
  ];

  const handleSendMessage = async () => {
    if (chatMessage.trim()) {
      const displayName = userName.trim() || 'Anonymous';
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
      {/* Live Stream Header */}
      <section className={`text-white py-6 ${showingRecentStream ? 'bg-gradient-to-r from-blue-600 to-blue-700' : (isLive ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-gray-600 to-gray-700')}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {showingRecentStream ? (
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                ) : isLive ? (
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                )}
                <span className="font-semibold">
                  {showingRecentStream ? 'RECENT' : (isLive ? 'LIVE' : 'OFFLINE')}
                </span>
              </div>
              <h1 className="text-2xl font-bold">
                {showingRecentStream ? (recentStream?.title || 'Recent Service') : 
                 (isLive ? (currentStream?.title || 'Sabbath Worship Service') : 'Live Stream')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLive && (
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{formatViewerCount(viewerCount)} watching</span>
                </div>
              )}
              <button 
                onClick={refreshStream}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <Play className="h-10 w-10 text-white ml-1" />
                        </div>
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
                      </div>
                    </div>
                  </>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="text-white hover:text-gray-300">
                        <Play className="h-6 w-6" />
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <Volume2 className="h-6 w-6" />
                      </button>
                      <div className="text-white text-sm">
                        {showingRecentStream ? 'RECENT SERVICE' : (isLive ? 'LIVE' : '00:00 / 00:00')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {showingRecentStream && (
                        <button 
                          onClick={() => setShowingRecentStream(false)}
                          className="text-white hover:text-gray-300 bg-black/50 px-3 py-1 rounded text-sm"
                        >
                          Back to Live
                        </button>
                      )}
                      <button className="text-white hover:text-gray-300">
                        <Settings className="h-6 w-6" />
                      </button>
                      <button className="text-white hover:text-gray-300">
                        <Maximize className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Service Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {isLive ? 'Live Service' : 'Service Information'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Title</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {isLive ? (currentStream?.title || 'Sabbath Worship Service') : 
                     (recentStream?.title || 'Sabbath Worship Service')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Channel</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentStream?.channelTitle || recentStream?.channelTitle || 'Mt. Olives SDA Church'}
                  </p>
                </div>
                {isLive && currentStream?.actualStartTime && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Started</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {new Date(currentStream.actualStartTime).toLocaleString()}
                    </p>
                  </div>
                )}
                {!isLive && recentStream?.publishedAt && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Last Service</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {new Date(recentStream.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Service Time</h3>
                  <p className="text-gray-600 dark:text-gray-300">11:00 AM - 12:30 PM EAT</p>
                </div>
              </div>
              {(currentStream?.description || recentStream?.description) && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
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
                className="mt-6 card p-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Streams</h2>
                <div className="space-y-4">
                  {upcomingStreams.map((stream, index) => (
                    <div key={stream.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      <img 
                        src={stream.thumbnailUrl} 
                        alt={stream.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{stream.title}</h3>
                        {stream.scheduledStartTime && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatScheduledTime(stream.scheduledStartTime)}
                          </p>
                        )}
                      </div>
                      <a
                        href={getYouTubeWatchUrl(stream.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm"
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
          <div className="space-y-6">
            {/* Live Chat */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card overflow-hidden"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Live Chat</h3>
                  {chatLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
                </div>
              </div>
              
              {chatError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                  <p className="text-red-800 dark:text-red-200 text-sm">{chatError}</p>
                </div>
              )}
              
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {isLive ? 'No messages yet. Be the first to say something!' : 'Chat will be available when the stream goes live.'}
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {msg.authorName}
                          {msg.superChatDetails && (
                            <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                              {msg.superChatDetails.amountDisplayString}
                            </span>
                          )}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          {formatTimeAgo(msg.publishedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{msg.displayMessage}</p>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                {/* Name input for anonymous users */}
                {!userName && isLive && (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name (optional)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 text-sm"
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400 disabled:opacity-50"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!isLive || !chatMessage.trim()}
                    className="btn-primary px-4 py-2 disabled:opacity-50"
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

            {/* Upcoming Services */}
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
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary py-2">
                  Request Prayer
                </button>
                <button className="w-full btn-accent py-2">
                  Give Online
                </button>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl dark:from-purple-400 dark:to-pink-400 dark:hover:from-purple-500 dark:hover:to-pink-500">
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