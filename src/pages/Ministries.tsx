import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ministriesAPI, Ministry } from '../services/api';

export const Ministries: React.FC = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMinistries();
  }, [currentPage]);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      const response = await ministriesAPI.getAll(currentPage, 12, 'active');
      
      if (response.success && response.data) {
        setMinistries(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.message || 'Failed to fetch ministries');
      }
    } catch (err) {
      setError('Failed to fetch ministries');
      console.error('Error fetching ministries:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pt-16">
        <div className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading ministries...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16">
        <div className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="text-red-600 dark:text-red-400 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Ministries</h2>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
              <button
                onClick={fetchMinistries}
                className="mt-4 px-6 py-2 bg-[#3f7f8c] hover:bg-[#2d5a65] text-white rounded-lg transition-colors dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Our <span className="text-gradient">Ministries</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the various ministries at Mt. Olives and find your place to serve, grow, and connect with our church family.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {ministries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏛️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Ministries Available</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Check back soon for updates on our ministries and service opportunities.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ministries.map((ministry, index) => (
                  <Link
                    key={ministry.id}
                    to={`/ministries/${ministry.slug}`}
                    className="block group"
                  >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card overflow-hidden hover:scale-105 transition-all duration-300 group-hover:scale-[1.02]"
                    >
                    {/* Ministry Image */}
                    <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                      {ministry.featured_image_data ? (
                        <img
                          src={ministriesAPI.getImageUrl(ministry.id)}
                          alt={ministry.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-white text-4xl">🏛️</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      </div>
                      
                    {/* Ministry Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {ministry.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {ministry.description}
                      </p>

                      {/* Ministry Details */}
                      <div className="space-y-2 mb-4">
                        {ministry.leader_name && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium mr-2">Leader:</span>
                            <span>{ministry.leader_name}</span>
                          </div>
                        )}
                        
                        {ministry.meeting_time && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium mr-2">Meeting:</span>
                            <span>{ministry.meeting_time}</span>
                          </div>
                        )}
                        
                        {ministry.meeting_location && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium mr-2">Location:</span>
                            <span>{ministry.meeting_location}</span>
                        </div>
                        )}
                        
                        {ministry.age_group && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium mr-2">Age Group:</span>
                            <span>{ministry.age_group}</span>
                        </div>
                        )}
                      </div>
                      
                      {/* Contact Info */}
                      {(ministry.leader_email || ministry.leader_phone) && (
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h4>
                          <div className="space-y-1">
                            {ministry.leader_email && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Email:</span> {ministry.leader_email}
                              </div>
                            )}
                            {ministry.leader_phone && (
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Phone:</span> {ministry.leader_phone}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          ministry.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {ministry.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Click to learn more
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    <span className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {/* Call to Action */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Involved?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              There's a place for everyone in our church family. Whether you're interested in music, youth ministry, 
              community outreach, or any other area, we'd love to help you find your calling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#3f7f8c] hover:bg-[#2d5a65] text-white px-8 py-3 rounded-lg transition-colors font-medium dark:bg-emerald-600 dark:hover:bg-emerald-700">
                Contact Us
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg transition-colors font-medium dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                Learn More About Our Church
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};