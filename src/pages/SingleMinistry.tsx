import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Phone, Mail, Users, Clock, Share2, ExternalLink } from 'lucide-react';
import { ministriesAPI, Ministry } from '../services/api';

export const SingleMinistry: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedMinistries, setRelatedMinistries] = useState<Ministry[]>([]);

  useEffect(() => {
    if (slug) {
      fetchMinistry();
    }
  }, [slug]);

  const fetchMinistry = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ministriesAPI.getBySlug(slug!);
      
      if (response.success && response.data) {
        setMinistry(response.data);
        fetchRelatedMinistries(response.data.id);
      } else {
        setError(response.message || 'Ministry not found');
      }
    } catch (err) {
      setError('Failed to load ministry');
      console.error('Error fetching ministry:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMinistries = async (currentMinistryId: number) => {
    try {
      const response = await ministriesAPI.getAll(1, 3, 'active');
      if (response.success && response.data) {
        // Filter out the current ministry and get up to 3 related ministries
        const related = response.data
          .filter(m => m.id !== currentMinistryId)
          .slice(0, 3);
        setRelatedMinistries(related);
      }
    } catch (err) {
      console.error('Error fetching related ministries:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ministry?.name || 'Ministry',
          text: ministry?.description || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ministry Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {error || 'The ministry you are looking for does not exist or has been removed.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="bg-[#3f7f8c] hover:bg-[#2d5a65] text-white px-6 py-3 rounded-lg transition-colors font-medium dark:bg-emerald-600 dark:hover:bg-emerald-700"
              >
                Go Back
              </button>
              <Link
                to="/ministries"
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg transition-colors font-medium dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                View All Ministries
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#3f7f8c] dark:hover:text-emerald-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/ministries" className="hover:text-[#3f7f8c] dark:hover:text-emerald-400 transition-colors">
            Ministries
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{ministry.name}</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#3f7f8c] dark:text-emerald-400 hover:text-[#2d5a65] dark:hover:text-emerald-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Ministries
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            {ministry.featured_image_data && (
              <div className="relative h-64 md:h-80">
                <img
                  src={ministriesAPI.getImageUrl(ministry.id)}
                  alt={ministry.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    ministry.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {ministry.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {ministry.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {ministry.description}
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#3f7f8c] dark:hover:text-emerald-400 transition-colors"
                  title="Share this ministry"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Ministry Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {ministry.leader_name && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#3f7f8c] dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Leader</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{ministry.leader_name}</p>
                    </div>
                  </div>
                )}
                
                {ministry.meeting_time && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#3f7f8c] dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Meeting Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{ministry.meeting_time}</p>
                    </div>
                  </div>
                )}
                
                {ministry.meeting_location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#3f7f8c] dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{ministry.meeting_location}</p>
                    </div>
                  </div>
                )}
                
                {ministry.age_group && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#3f7f8c] dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Age Group</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{ministry.age_group}</p>
                    </div>
                  </div>
                )}
                
                {ministry.leader_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#3f7f8c] dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <a 
                        href={`mailto:${ministry.leader_email}`}
                        className="text-sm text-[#3f7f8c] dark:text-emerald-400 hover:underline"
                      >
                        {ministry.leader_email}
                      </a>
                    </div>
                  </div>
                )}
                
                {ministry.leader_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#3f7f8c] dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                      <a 
                        href={`tel:${ministry.leader_phone}`}
                        className="text-sm text-[#3f7f8c] dark:text-emerald-400 hover:underline"
                      >
                        {ministry.leader_phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          {ministry.long_description && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                About This Ministry
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {ministry.long_description}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {ministry.requirements && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Requirements
              </h2>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {ministry.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {ministry.contact_info && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {ministry.contact_info}
                </p>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#3f7f8c] to-[#2d5a65] dark:from-emerald-600 dark:to-teal-600 rounded-xl shadow-lg p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Join This Ministry
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Ready to get involved? Contact the ministry leader or attend one of our meetings to learn more about how you can participate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {ministry.leader_email && (
                <a
                  href={`mailto:${ministry.leader_email}`}
                  className="bg-white text-[#3f7f8c] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact Leader
                </a>
              )}
              <Link
                to="/contact"
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Get More Information
              </Link>
            </div>
          </div>

          {/* Related Ministries */}
          {relatedMinistries.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Other Ministries You Might Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedMinistries.map((relatedMinistry) => (
                  <Link
                    key={relatedMinistry.id}
                    to={`/ministries/${relatedMinistry.slug}`}
                    className="group block"
                  >
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        {relatedMinistry.featured_image_data ? (
                          <img
                            src={ministriesAPI.getImageUrl(relatedMinistry.id)}
                            alt={relatedMinistry.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#3f7f8c] dark:bg-emerald-600 flex items-center justify-center">
                            <span className="text-white text-lg">🏛️</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#3f7f8c] dark:group-hover:text-emerald-400 transition-colors">
                            {relatedMinistry.name}
                          </h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            relatedMinistry.status === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {relatedMinistry.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {relatedMinistry.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Ministry Meta */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <p>Created on {formatDate(ministry.created_at)}</p>
                {ministry.updated_at !== ministry.created_at && (
                  <p>Last updated on {formatDate(ministry.updated_at)}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-[#3f7f8c] dark:text-emerald-400 hover:text-[#2d5a65] dark:hover:text-emerald-300 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 