import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, 
  Calendar, User, Tag, MoreVertical, FileText, Loader2
} from 'lucide-react';
import { postsAPI, type Post } from '../services/api';
import { PostModal } from '../components/PostModal';

export const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await postsAPI.getAll({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        limit: 50
      });

      if (response.success && response.data) {
        setPosts(response.data);
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

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, categoryFilter]);

  // Handle modal success
  const handleModalSuccess = () => {
    fetchPosts();
    fetchCategories();
  };

  // Handle edit post
  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setShowCreateModal(true);
  };

  // Handle delete post
  const handleDeletePost = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(postId);
      const response = await postsAPI.delete(postId);
      
      if (response.success) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert(response.message || 'Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
      console.error('Error deleting post:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle create new post
  const handleCreatePost = () => {
    setSelectedPost(null);
    setShowCreateModal(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedPost(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAuthorName = (post: Post) => {
    if (post.first_name && post.last_name) {
      return `${post.first_name} ${post.last_name}`;
    }
    return post.author_email || 'Unknown Author';
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h2>
            <p className="text-gray-600 dark:text-gray-300">Manage your church posts and announcements</p>
          </div>
          <button
            onClick={handleCreatePost}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </button>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span className="text-gray-600 dark:text-gray-300">Loading posts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your church posts and announcements</p>
        </div>
        <button
          onClick={handleCreatePost}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Post</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {posts.map((post) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {post.featured_image_name ? (
                          <img 
                            src={postsAPI.getImageUrl(post.id)} 
                            alt={post.title}
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center ${post.featured_image_name ? 'hidden' : ''}`}>
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {post.excerpt || 'No excerpt available'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {getAuthorName(post)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {post.view_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => window.open(`/posts/${post.slug}`, '_blank')}
                        className={`${
                          post.status === 'published' 
                            ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300' 
                            : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                        title={post.status === 'published' ? 'View post' : 'Post not published'}
                        disabled={post.status !== 'published'}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditPost(post)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deleteLoading === post.id}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-50"
                        title="Delete post"
                      >
                        {deleteLoading === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No posts found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by creating your first post.'}
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={handleCreatePost}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Modal */}
      <PostModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        post={selectedPost}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}; 