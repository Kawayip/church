import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Download, Search, Calendar, User, Clock, BookOpen } from 'lucide-react';

export const Sermons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('all');

  const sermons = [
    {
      id: 1,
      title: 'Walking by Faith in Uncertain Times',
      speaker: 'Pastor John Mukasa',
      date: '2025-01-04',
      duration: '45 min',
      series: 'Faith in Action',
      scripture: '2 Corinthians 5:7',
      description: 'Discover how to trust God completely when life becomes uncertain and challenging.',
      thumbnail: 'https://images.pexels.com/photos/8466886/pexels-photo-8466886.jpeg',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 2,
      title: 'The Power of Prayer',
      speaker: 'Elder Sarah Namukasa',
      date: '2024-12-28',
      duration: '38 min',
      series: 'Spiritual Disciplines',
      scripture: 'Matthew 6:9-13',
      description: 'Understanding the transformative power of prayer in our daily Christian walk.',
      thumbnail: 'https://images.pexels.com/photos/8112175/pexels-photo-8112175.jpeg',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 3,
      title: 'Love in Action',
      speaker: 'Pastor John Mukasa',
      date: '2024-12-21',
      duration: '42 min',
      series: 'Christmas Series',
      scripture: '1 John 4:7-21',
      description: 'How God\'s love transforms us and empowers us to love others unconditionally.',
      thumbnail: 'https://images.pexels.com/photos/8466704/pexels-photo-8466704.jpeg',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 4,
      title: 'Hope for the Future',
      speaker: 'Elder Moses Kiprotich',
      date: '2024-12-14',
      duration: '40 min',
      series: 'Prophecy Series',
      scripture: 'Revelation 21:1-4',
      description: 'Finding hope and assurance in God\'s promises for the future.',
      thumbnail: 'https://images.pexels.com/photos/7551661/pexels-photo-7551661.jpeg',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 5,
      title: 'Stewardship and Generosity',
      speaker: 'Deacon Peter Wamala',
      date: '2024-12-07',
      duration: '35 min',
      series: 'Christian Living',
      scripture: '2 Corinthians 9:6-8',
      description: 'Understanding our role as faithful stewards of God\'s blessings.',
      thumbnail: 'https://images.pexels.com/photos/6647022/pexels-photo-6647022.jpeg',
      audioUrl: '#',
      videoUrl: '#'
    },
    {
      id: 6,
      title: 'The Sabbath Rest',
      speaker: 'Pastor John Mukasa',
      date: '2024-11-30',
      duration: '47 min',
      series: 'Biblical Foundations',
      scripture: 'Exodus 20:8-11',
      description: 'Rediscovering the blessing and importance of the Sabbath in our modern world.',
      thumbnail: 'https://images.pexels.com/photos/8466847/pexels-photo-8466847.jpeg',
      audioUrl: '#',
      videoUrl: '#'
    }
  ];

  const sermonSeries = [
    { id: 'all', name: 'All Sermons' },
    { id: 'Faith in Action', name: 'Faith in Action' },
    { id: 'Spiritual Disciplines', name: 'Spiritual Disciplines' },
    { id: 'Christmas Series', name: 'Christmas Series' },
    { id: 'Prophecy Series', name: 'Prophecy Series' },
    { id: 'Christian Living', name: 'Christian Living' },
    { id: 'Biblical Foundations', name: 'Biblical Foundations' }
  ];

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeries = selectedSeries === 'all' || sermon.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  return (
    <div className="pt-16">
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
              Sermon <span className="text-gradient">Archive</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Listen to inspiring messages from our pastoral team. Grow in faith through 
              biblical teaching and practical application for daily Christian living.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sermons, speakers, or scriptures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Series Filter */}
            <div className="flex flex-wrap gap-2">
              {sermonSeries.map((series) => (
                <button
                  key={series.id}
                  onClick={() => setSelectedSeries(series.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSeries === series.id
                      ? 'btn-primary'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {series.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sermon */}
      {filteredSermons.length > 0 && (
        <section className="py-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="card overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={filteredSermons[0].thumbnail} 
                    alt={filteredSermons[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="mb-4">
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                      Latest Sermon
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{filteredSermons[0].title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{filteredSermons[0].description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {filteredSermons[0].speaker}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {new Date(filteredSermons[0].date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {filteredSermons[0].duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {filteredSermons[0].scripture}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn-primary flex items-center justify-center">
                      <Play className="mr-2 h-5 w-5" />
                      Watch Video
                    </button>
                    <button className="btn-secondary flex items-center justify-center">
                      <Download className="mr-2 h-5 w-5" />
                      Download Audio
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Sermon Grid */}
      <section className="py-20 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermons.slice(1).map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <img 
                    src={sermon.thumbnail} 
                    alt={sermon.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-emerald-600 p-3 rounded-full hover:scale-110 transition-transform">
                      <Play className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {sermon.duration}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-3">
                    <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                      {sermon.series}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {sermon.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {sermon.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {sermon.speaker}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {new Date(sermon.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-2 text-emerald-500 dark:text-emerald-400" />
                      {sermon.scripture}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary text-sm py-2 px-3">
                      Watch
                    </button>
                    <button className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredSermons.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No sermons found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 section-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Never Miss a Sermon</h2>
            <p className="text-xl mb-8 text-emerald-100">
              Subscribe to our podcast or YouTube channel to get the latest sermons delivered to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200">
                Subscribe to Podcast
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-200">
                YouTube Channel
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};