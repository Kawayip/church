import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, MessageCircle, Share2, Volume2, Maximize, Settings } from 'lucide-react';

export const Live: React.FC = () => {
  const [isLive, setIsLive] = useState(true);
  const [viewerCount, setViewerCount] = useState(247);
  const [chatMessage, setChatMessage] = useState('');

  const chatMessages = [
    { user: 'Sarah M.', message: 'Praise the Lord! Beautiful service today 🙏', time: '2 min ago' },
    { user: 'John K.', message: 'Amen to that powerful message!', time: '3 min ago' },
    { user: 'Grace L.', message: 'Watching from Jinja. God bless you all!', time: '5 min ago' },
    { user: 'David S.', message: 'Thank you for the live stream. Very inspiring!', time: '7 min ago' },
  ];

  const upcomingServices = [
    { title: 'Sabbath Worship Service', date: 'Saturday, Jan 4', time: '11:00 AM' },
    { title: 'Prayer Meeting', date: 'Wednesday, Jan 8', time: '7:00 PM' },
    { title: 'Youth Sabbath', date: 'Saturday, Jan 11', time: '11:00 AM' },
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Live Stream Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">LIVE</span>
              </div>
              <h1 className="text-2xl font-bold">Sabbath Worship Service</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>{viewerCount} watching</span>
              </div>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <img 
                  src="https://images.pexels.com/photos/8466704/pexels-photo-8466704.jpeg"
                  alt="Live Stream"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  {isLive ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play className="h-10 w-10 text-white ml-1" />
                      </div>
                      <p className="text-white text-lg font-semibold">Live Stream Active</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Play className="h-10 w-10 text-white ml-1" />
                      </div>
                      <p className="text-white text-lg font-semibold">Stream Offline</p>
                      <p className="text-gray-300">Next service: Saturday 11:00 AM</p>
                    </div>
                  )}
                </div>

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
                        {isLive ? 'LIVE' : '00:00 / 00:00'}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Today's Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sermon Topic</h3>
                  <p className="text-gray-600 dark:text-gray-300">"Walking by Faith in Uncertain Times"</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Speaker</h3>
                  <p className="text-gray-600 dark:text-gray-300">Pastor John Mukasa</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scripture Reading</h3>
                  <p className="text-gray-600 dark:text-gray-300">2 Corinthians 5:7</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Service Time</h3>
                  <p className="text-gray-600 dark:text-gray-300">11:00 AM - 12:30 PM EAT</p>
                </div>
              </div>
            </motion.div>
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
                </div>
              </div>
              
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">{msg.user}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-white dark:placeholder-gray-400"
                  />
                  <button className="btn-primary px-4 py-2">
                    Send
                  </button>
                </div>
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