import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Music, FileText, X, Play, Download, Loader2, AlertCircle } from 'lucide-react';
import { galleryAPI, type GalleryImage } from '../services/api';

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryAPI.getAll({
        page: currentPage,
        limit: 12,
        category: selectedCategory === 'all' ? undefined : selectedCategory
      });
      
      if (response.success && response.data) {
        setImages(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError(response.message || 'Failed to fetch images');
      }
    } catch (err) {
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All Images', icon: Image },
    { id: 'events', name: 'Events', icon: Image },
    { id: 'services', name: 'Services', icon: Image },
    { id: 'outreach', name: 'Outreach', icon: Image },
    { id: 'youth', name: 'Youth', icon: Image },
    { id: 'general', name: 'General', icon: Image }
  ];

  const filteredItems = images;

  const getTypeIcon = (type: string) => {
    return Image; // All gallery items are images
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
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading images...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Images</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button onClick={fetchImages} className="btn-primary">Try Again</button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No images found</h3>
              <p className="text-gray-500 dark:text-gray-500">Try selecting a different category to see more content.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => {
                  const TypeIcon = getTypeIcon('image');
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={galleryAPI.getImage(item.id)} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                        
                        {/* Type Icon */}
                        <div className="absolute top-3 right-3 p-2 bg-black/80 dark:bg-slate-900/80 rounded-lg">
                          <TypeIcon className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-500">
                          <span className="capitalize">{item.category}</span>
                          <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
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
              <img 
                src={galleryAPI.getImage(selectedMedia.id)} 
                alt={selectedMedia.title}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">{selectedMedia.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Category:</span>
                    <span className="ml-2 capitalize text-gray-900 dark:text-white">
                      {selectedMedia.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Uploaded:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(selectedMedia.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};