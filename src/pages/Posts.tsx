import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Calendar, User, Tag, Eye, 
  Loader2, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { postsAPI, type Post } from '../services/api';

export const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  const postsPerPage = 9;

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getPublished({
        page: currentPage,
        limit: postsPerPage,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchTerm || undefined
      });

      if (response.success && response.data) {
        setPosts(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await postsAPI.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Refetch when filters or page changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoryFilter]);

  // Refetch when page changes
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorName = (post: Post) => {
    if (post.first_name && post.last_name) {
      return `${post.first_name} ${post.last_name}`;
    }
    return post.author_email || 'Unknown Author';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading && posts.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-gray-600 dark:text-gray-300">Loading posts...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Church Posts & Announcements
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Stay updated with the latest news, announcements, and insights from our church community.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Post Image */}
                <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden">
                  {post.featured_image_name ? (
                    <img 
                      src={postsAPI.getImageUrl(post.id)} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`flex items-center justify-center ${post.featured_image_name ? 'hidden' : ''}`}>
                    <FileText className="h-12 w-12 text-white" />
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                      {post.category}
                    </span>
                    {post.is_featured && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    <Link 
                      to={`/posts/${post.slug}`}
                      className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt || truncateText(post.content, 150)}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{getAuthorName(post)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.view_count}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Check back soon for new posts.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 