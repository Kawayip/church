import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Eye, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Bookmark,
  Clock,
  FileText
} from 'lucide-react';
import { postsAPI, type Post } from '../services/api';

export const SinglePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get all posts and find the one with matching slug
        const response = await postsAPI.getPublished();
        
        if (response.success && response.data) {
          const foundPost = response.data.find(p => p.slug === slug);
          
          if (foundPost) {
            setPost(foundPost);
            
            // Get related posts (same category, excluding current post)
            const related = response.data
              .filter(p => p.id !== foundPost.id && p.category === foundPost.category)
              .slice(0, 3);
            setRelatedPosts(related);
          } else {
            setError('Post not found');
          }
        } else {
          setError('Failed to load post');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

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
    return 'Anonymous';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || '',
        text: post?.excerpt || '',
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The post you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/posts')}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/posts')}
            className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </button>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/posts" className="hover:text-emerald-600 dark:hover:text-emerald-400">Posts</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden"
        >
          {/* Featured Image */}
          {post.featured_image_name && (
            <div className="relative h-96 bg-gradient-to-br from-emerald-500 to-teal-600">
              <img
                src={postsAPI.getImageUrl(post.id)}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {post.is_featured && (
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    Featured
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Post Content */}
          <div className="p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{getAuthorName(post)}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{post.view_count.toLocaleString()} views</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-3">
                  <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border-l-4 border-emerald-500">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert prose-emerald">
              <div 
                className="text-gray-800 dark:text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </button>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {formatDate(post.updated_at)}
              </div>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Posts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/posts/${relatedPost.slug}`}
                  className="block bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Post Image */}
                  <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden">
                    {relatedPost.featured_image_name ? (
                      <img 
                        src={postsAPI.getImageUrl(relatedPost.id)} 
                        alt={relatedPost.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center ${relatedPost.featured_image_name ? 'hidden' : ''}`}>
                      <FileText className="h-12 w-12 text-white" />
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                        {relatedPost.category}
                      </span>
                      {relatedPost.is_featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                      {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{getAuthorName(relatedPost)}</span>
                      <span>{formatDate(relatedPost.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}; 