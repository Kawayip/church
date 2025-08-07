import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Calendar, FileText, Settings, 
  Plus, Edit, Trash2, Image, DollarSign, Bell, 
  Eye, MessageSquare, Upload, LogOut, User, Moon, Sun, Loader2, AlertCircle, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, type Resource } from '../services/api';
import { ResourceModal } from '../components/ResourceModal';
import { AdminPosts } from './AdminPosts';
import { AdminMinistries } from './AdminMinistries';
import { AdminEvents } from './AdminEvents';
import { AdminGallery } from './AdminGallery';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // Resources state
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [resourcesSearchTerm, setResourcesSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Resources functions
  const fetchResources = async () => {
    try {
      setResourcesLoading(true);
      setResourcesError(null);
      
      const response = await resourcesAPI.getAll();
      
      if (response.success && response.data) {
        console.log('Resources data:', response.data); // Debug log
        setResources(response.data);
      } else {
        setResourcesError(response.message || 'Failed to fetch resources');
      }
    } catch (err) {
      setResourcesError('Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setResourcesLoading(false);
    }
  };

  const handleCreateResource = () => {
    setSelectedResource(null);
    setIsResourceModalOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsResourceModalOpen(true);
  };

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await resourcesAPI.delete(id);
      
      if (response.success) {
        setResources(prev => prev.filter(resource => resource.id !== id));
      } else {
        alert(response.message || 'Failed to delete resource');
      }
    } catch (err) {
      alert('Failed to delete resource');
      console.error('Error deleting resource:', err);
    }
  };

  const handleResourceModalSuccess = () => {
    setIsResourceModalOpen(false);
    setSelectedResource(null);
    fetchResources();
  };

  const handleCloseResourceModal = () => {
    setIsResourceModalOpen(false);
    setSelectedResource(null);
  };

  // Fetch resources when resources tab is active
  useEffect(() => {
    if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab]);

  const stats = [
    { label: 'Total Members', value: '1,247', change: '+12', icon: Users, color: 'emerald' },
    { label: 'Monthly Giving', value: 'UGX 15.2M', change: '+8%', icon: DollarSign, color: 'amber' },
    { label: 'Events This Month', value: '24', change: '+3', icon: Calendar, color: 'blue' },
    { label: 'Website Views', value: '5,847', change: '+15%', icon: Eye, color: 'purple' }
  ];

  const recentPosts = [
    { id: 1, title: 'New Year Revival Services', status: 'published', date: '2025-01-01' },
    { id: 2, title: 'Youth Ministry Retreat', status: 'draft', date: '2025-01-02' },
    { id: 3, title: 'Health Fair Announcement', status: 'published', date: '2024-12-30' }
  ];

  const recentEvents = [
    { id: 1, title: 'Sabbath Worship Service', date: '2025-01-04', attendees: 350 },
    { id: 2, title: 'Prayer Meeting', date: '2025-01-08', attendees: 120 },
    { id: 3, title: 'Community Health Fair', date: '2025-01-12', attendees: 0 }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'posts', name: 'Posts', icon: FileText },
    { id: 'ministries', name: 'Ministries', icon: Users },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'resources', name: 'Resources', icon: FileText },
    { id: 'gallery', name: 'Gallery', icon: Image },
    { id: 'members', name: 'Members', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.label} className="card p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${
                          stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {stat.change}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                        <IconComponent className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Posts */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Posts</h3>
                  <button 
                    onClick={() => setActiveTab('posts')}
                    className="btn-primary text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Post
                  </button>
                </div>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Events */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Events</h3>
                  <button className="btn-primary text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Event
                  </button>
                </div>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{event.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.attendees}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">attendees</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'posts':
        return <AdminPosts />;
      
      case 'ministries':
        return <AdminMinistries />;
      
      case 'events':
        return <AdminEvents />;
      
      case 'gallery':
        return <AdminGallery />;
      
      case 'resources':
        return (
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Resources</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Upload and manage church resources, study materials, and documents
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={handleCreateResource}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Resource</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={resourcesSearchTerm}
                  onChange={(e) => setResourcesSearchTerm(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
            </div>

            {/* Resources List */}
            {resourcesLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
              </div>
            ) : resourcesError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Resources</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{resourcesError}</p>
                <button onClick={fetchResources} className="btn-primary">Try Again</button>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Resource
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                      {resources
                        .filter(resource => 
                          resource.title.toLowerCase().includes(resourcesSearchTerm.toLowerCase()) ||
                          (resource.description && resource.description.toLowerCase().includes(resourcesSearchTerm.toLowerCase()))
                        )
                        .map((resource) => (
                        <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-600 text-gray-500">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {resource.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {resource.description || 'No description'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {resource.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-600 dark:text-gray-200">
                              {(resource.file_type || 'unknown').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {resource.download_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEditResource(resource)}
                                className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteResource(resource.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {resources.filter(resource => 
                  resource.title.toLowerCase().includes(resourcesSearchTerm.toLowerCase()) ||
                  (resource.description && resource.description.toLowerCase().includes(resourcesSearchTerm.toLowerCase()))
                ).length === 0 && !resourcesLoading && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resources found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Get started by adding your first resource.</p>
                  </div>
                )}
              </div>
            )}

            {/* Resource Modal */}
            <ResourceModal
              isOpen={isResourceModalOpen}
              resource={selectedResource}
              onSuccess={handleResourceModalSuccess}
              onClose={handleCloseResourceModal}
            />
          </div>
        );
      
      default:
        return (
          <div className="card p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.name} Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This section is under development. Coming soon!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button className="p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.first_name} {user?.last_name}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-48">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'btn-primary'
                        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};