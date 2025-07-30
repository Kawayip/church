import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { ministriesAPI, Ministry } from '../services/api';
import { MinistryModal } from '../components/MinistryModal';

export const AdminMinistries: React.FC = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ministriesAPI.getAll(1, 100, 'all');
      
      if (response.success && response.data) {
        setMinistries(response.data);
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

  const handleCreateMinistry = () => {
    setSelectedMinistry(null);
    setIsModalOpen(true);
  };

  const handleEditMinistry = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setIsModalOpen(true);
  };

  const handleDeleteMinistry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this ministry? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await ministriesAPI.delete(id);
      
      if (response.success) {
        setMinistries(prev => prev.filter(ministry => ministry.id !== id));
      } else {
        alert(response.message || 'Failed to delete ministry');
      }
    } catch (err) {
      alert('Failed to delete ministry');
      console.error('Error deleting ministry:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedMinistry(null);
    fetchMinistries();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMinistry(null);
  };

  const filteredMinistries = ministries.filter(ministry => {
    const matchesSearch = ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ministry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ministry.leader_name && ministry.leader_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || ministry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ministries Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage church ministries and their information</p>
        </div>
        <button
          onClick={handleCreateMinistry}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Ministry
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-red-400 text-xl">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchMinistries}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search ministries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Ministries Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ministry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Leader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Meeting Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMinistries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter !== 'all' ? 'No ministries match your filters.' : 'No ministries available.'}
                  </td>
                </tr>
              ) : (
                filteredMinistries.map((ministry, index) => (
                  <motion.tr
                    key={ministry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {ministry.featured_image_data ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={ministriesAPI.getImageUrl(ministry.id)}
                              alt={ministry.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                              <span className="text-emerald-600 dark:text-emerald-400 text-lg">🏛️</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {ministry.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {ministry.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {ministry.leader_name || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {ministry.meeting_time || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ministry.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {ministry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(ministry.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditMinistry(ministry)}
                          className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                          title="Edit ministry"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMinistry(ministry.id)}
                          disabled={deleteLoading === ministry.id}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                          title="Delete ministry"
                        >
                          {deleteLoading === ministry.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
              <span className="text-2xl">🏛️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Ministries</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{ministries.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Ministries</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {ministries.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <span className="text-2xl">⏸️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive Ministries</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {ministries.filter(m => m.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ministry Modal */}
      <MinistryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        ministry={selectedMinistry}
      />
    </div>
  );
}; 