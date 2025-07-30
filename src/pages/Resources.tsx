import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, BookOpen, Music, Video, Calendar } from 'lucide-react';

export const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    {
      id: 1,
      title: 'Weekly Bulletin - January 4, 2025',
      description: 'Order of service, announcements, and prayer requests for this week\'s Sabbath service.',
      category: 'bulletins',
      type: 'pdf',
      date: '2025-01-04',
      size: '2.3 MB',
      downloads: 145
    },
    {
      id: 2,
      title: 'Sermon: Walking by Faith',
      description: 'Pastor John\'s inspiring message about trusting God in uncertain times.',
      category: 'sermons',
      type: 'audio',
      date: '2025-01-01',
      size: '45.2 MB',
      downloads: 289
    },
    {
      id: 3,
      title: 'Bible Study Guide: Book of Daniel',
      description: 'Comprehensive 13-week study guide exploring the prophetic book of Daniel.',
      category: 'study-guides',
      type: 'pdf',
      date: '2024-12-15',
      size: '5.7 MB',
      downloads: 432
    },
    {
      id: 4,
      title: 'Children\'s Sabbath School Materials',
      description: 'Lesson plans, activities, and crafts for children ages 5-12.',
      category: 'sabbath-school',
      type: 'zip',
      date: '2025-01-01',
      size: '12.4 MB',
      downloads: 78
    },
    {
      id: 5,
      title: 'Hymnal Collection - Traditional Favorites',
      description: 'Sheet music and audio recordings of beloved traditional hymns.',
      category: 'music',
      type: 'zip',
      date: '2024-12-20',
      size: '87.3 MB',
      downloads: 203
    },
    {
      id: 6,
      title: 'Health Ministry: Plant-Based Recipes',
      description: 'Delicious and nutritious plant-based recipes for healthy living.',
      category: 'health',
      type: 'pdf',
      date: '2024-12-10',
      size: '3.1 MB',
      downloads: 167
    },
    {
      id: 7,
      title: 'Youth Ministry Devotional',
      description: 'Daily devotions specifically designed for teenagers and young adults.',
      category: 'youth',
      type: 'pdf',
      date: '2024-12-25',
      size: '2.8 MB',
      downloads: 124
    },
    {
      id: 8,
      title: 'Evangelism Training Video Series',
      description: 'Complete video course on effective personal evangelism methods.',
      category: 'training',
      type: 'video',
      date: '2024-11-30',
      size: '1.2 GB',
      downloads: 89
    }
  ];

  const categories = [
    { id: 'all', name: 'All Resources', icon: FileText },
    { id: 'bulletins', name: 'Bulletins', icon: Calendar },
    { id: 'sermons', name: 'Sermons', icon: BookOpen },
    { id: 'study-guides', name: 'Study Guides', icon: BookOpen },
    { id: 'sabbath-school', name: 'Sabbath School', icon: BookOpen },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'health', name: 'Health Ministry', icon: FileText },
    { id: 'youth', name: 'Youth', icon: FileText },
    { id: 'training', name: 'Training', icon: Video }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return Music;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-400';
      case 'audio': return 'text-blue-400';
      case 'video': return 'text-purple-400';
      case 'zip': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

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
              Church <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access sermons, study materials, bulletins, and other resources to support your spiritual journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
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

      {/* Resources Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const FileIcon = getFileIcon(resource.type);
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gray-100 dark:bg-slate-700 ${getFileColor(resource.type)}`}>
                      <FileIcon className="h-6 w-6" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full uppercase ${getFileColor(resource.type)} bg-gray-100 dark:bg-slate-700`}>
                      {resource.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>{new Date(resource.date).toLocaleDateString()}</span>
                    <span>{resource.size}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.downloads} downloads
                    </span>
                    <button className="btn-primary flex items-center space-x-2 text-sm px-4 py-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Downloads */}
      <section className="py-16 section-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Most Popular Downloads</h2>
            <p className="text-emerald-100">Our most requested resources this month</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources
              .sort((a, b) => b.downloads - a.downloads)
              .slice(0, 3)
              .map((resource, index) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white/10 dark:bg-emerald-500/10 border border-white/20 dark:border-emerald-500/20 rounded-xl p-6 text-center backdrop-blur-sm"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">#{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                  <p className="text-emerald-100 text-sm mb-4">{resource.downloads} downloads</p>
                  <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-all duration-200">
                    Download Now
                  </button>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};