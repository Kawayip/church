import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Filter, BookOpen, Music, Video, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { resourcesAPI, filesAPI, type Resource } from '../services/api';

import { trackDownloadClick } from '../services/downloadTracking';

export const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

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

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await resourcesAPI.getAll(params);
      
      if (response.success && response.data) {
        // Transform the data to handle snake_case to camelCase conversion
        const transformedData = response.data.map((resource: any) => ({
          ...resource,
          downloadCount: resource.download_count || 0,
          fileName: resource.file_name,
          fileSize: resource.file_size,
          fileType: resource.file_type,
          mimeType: resource.mime_type,
          isFeatured: resource.is_featured
        }));
        setResources(transformedData);
      } else {
        setError(response.message || 'Failed to fetch resources');
      }
    } catch (err) {
      setError('Failed to fetch resources. Please try again.');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle download
  const handleDownload = async (resource: Resource) => {
    try {
      setDownloading(resource.id);
      
      // Track download with our service
      const fileUrl = filesAPI.getResource(resource.id);
      await trackDownloadClick(fileUrl, resource.fileName);
      
      // Track download with API
      await resourcesAPI.download(resource.id);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = resource.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update the resource's download count locally
      setResources(prev => prev.map(r => 
        r.id === resource.id 
          ? { ...r, downloadCount: (r.downloadCount || 0) + 1 }
          : r
      ));
      
    } catch (err) {
      console.error('Error downloading resource:', err);
      alert('Failed to download resource. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  // Fetch resources when component mounts or filters change
  useEffect(() => {
    fetchResources();
  }, [selectedCategory, searchTerm]);

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
      case 'doc': return 'text-blue-600';
      case 'image': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Resources</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button 
                onClick={fetchResources}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => {
                  const FileIcon = getFileIcon(resource.fileType);
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card p-6 hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gray-100 dark:bg-slate-700 ${getFileColor(resource.fileType)}`}>
                          <FileIcon className="h-6 w-6" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full uppercase ${getFileColor(resource.fileType)} bg-gray-100 dark:bg-slate-700`}>
                          {resource.fileType}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {resource.description || 'No description available'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                        <span>{formatFileSize(resource.fileSize)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.downloadCount} downloads
                        </span>
                        <button 
                          onClick={() => handleDownload(resource)}
                          disabled={downloading === resource.id}
                          className="btn-primary flex items-center space-x-2 text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloading === resource.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          <span>{downloading === resource.id ? 'Downloading...' : 'Download'}</span>
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
            </>
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
              .sort((a, b) => b.downloadCount - a.downloadCount)
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
                  <p className="text-emerald-100 text-sm mb-4">{resource.downloadCount} downloads</p>
                  <button 
                    onClick={() => handleDownload(resource)}
                    disabled={downloading === resource.id}
                    className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading === resource.id ? 'Downloading...' : 'Download Now'}
                  </button>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};