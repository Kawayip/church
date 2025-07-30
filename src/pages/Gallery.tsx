import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Music, FileText, X, Play, Download } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  const mediaItems = [
    {
      id: 1,
      title: 'Sabbath Worship Service',
      type: 'image',
      category: 'worship',
      url: 'https://images.pexels.com/photos/8466704/pexels-photo-8466704.jpeg',
      description: 'Beautiful moments from our Sabbath worship service'
    },
    {
      id: 2,
      title: 'Youth Ministry Retreat',
      type: 'image',
      category: 'youth',
      url: 'https://images.pexels.com/photos/7551661/pexels-photo-7551661.jpeg',
      description: 'Young people growing in faith together'
    },
    {
      id: 3,
      title: 'Sunday Sermon: Faith in Action',
      type: 'video',
      category: 'sermons',
      url: 'https://example.com/sermon1.mp4',
      thumbnail: 'https://images.pexels.com/photos/8466886/pexels-photo-8466886.jpeg',
      description: 'Pastor John shares about living out our faith'
    },
    {
      id: 4,
      title: 'Community Health Fair',
      type: 'image',
      category: 'community',
      url: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg',
      description: 'Serving our community with health and wellness'
    },
    {
      id: 5,
      title: 'Praise & Worship Songs',
      type: 'audio',
      category: 'music',
      url: 'https://example.com/worship-songs.mp3',
      thumbnail: 'https://images.pexels.com/photos/6647022/pexels-photo-6647022.jpeg',
      description: 'Beautiful worship music from our choir'
    },
    {
      id: 6,
      title: 'Bible Study Guide - Revelation',
      type: 'document',
      category: 'resources',
      url: 'https://example.com/revelation-study.pdf',
      thumbnail: 'https://images.pexels.com/photos/8112175/pexels-photo-8112175.jpeg',
      description: 'Comprehensive study guide for the book of Revelation'
    },
    {
      id: 7,
      title: 'Baptism Ceremony',
      type: 'image',
      category: 'worship',
      url: 'https://images.pexels.com/photos/8466847/pexels-photo-8466847.jpeg',
      description: 'Celebrating new life in Christ'
    },
    {
      id: 8,
      title: 'Women\'s Ministry Meeting',
      type: 'image',
      category: 'ministry',
      url: 'https://images.pexels.com/photos/7551422/pexels-photo-7551422.jpeg',
      description: 'Women supporting and encouraging each other'
    },
    {
      id: 9,
      title: 'Children\'s Sabbath School',
      type: 'video',
      category: 'youth',
      url: 'https://example.com/children-ss.mp4',
      thumbnail: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg',
      description: 'Children learning about God\'s love'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Media', icon: Image },
    { id: 'worship', name: 'Worship', icon: Image },
    { id: 'youth', name: 'Youth & Children', icon: Image },
    { id: 'sermons', name: 'Sermons', icon: Video },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'community', name: 'Community', icon: Image },
    { id: 'ministry', name: 'Ministries', icon: Image },
    { id: 'resources', name: 'Resources', icon: FileText }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'document': return FileText;
      default: return Image;
    }
  };

  return (
    <div className="pt-16 bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Media <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our collection of worship services, sermons, music, and community events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'btn-primary'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedMedia(item)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.thumbnail || item.url} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    
                    {/* Type Icon */}
                    <div className="absolute top-3 right-3 p-2 bg-black/80 dark:bg-slate-900/80 rounded-lg">
                      <TypeIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    </div>

                    {/* Play button for videos/audio */}
                    {(item.type === 'video' || item.type === 'audio') && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-emerald-500/90 rounded-full flex items-center justify-center group-hover:bg-emerald-600/90 transition-colors">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Image className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No media found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try selecting a different category to see more content.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedMedia.title}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {selectedMedia.type === 'image' && (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title}
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              )}
              
              {selectedMedia.type === 'video' && (
                <div className="aspect-video bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600 dark:text-gray-400">Video player would be implemented here</p>
                </div>
              )}
              
              {selectedMedia.type === 'audio' && (
                <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-8 text-center">
                  <Music className="h-16 w-16 text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Audio player would be implemented here</p>
                </div>
              )}
              
              {selectedMedia.type === 'document' && (
                <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-8 text-center">
                  <FileText className="h-16 w-16 text-emerald-500 dark:text-emerald-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Document preview would be implemented here</p>
                  <button className="btn-primary flex items-center space-x-2 mx-auto">
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              )}
              
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">{selectedMedia.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};