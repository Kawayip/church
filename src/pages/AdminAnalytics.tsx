import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Eye, TrendingUp, Calendar, 
  Monitor, Smartphone, Tablet, Globe, Clock,
  RefreshCw, Download, Filter, Search, ArrowUpRight,
  ArrowDownRight, Activity, MapPin, Browser, MonitorSmartphone
} from 'lucide-react';
import { analyticsAPI, formatNumber, formatDuration, formatPercentage, type DashboardStats, type SessionData } from '../services/analytics';

export const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analyticsAPI.getDashboardStats(timeRange);
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async (page: number = 1) => {
    try {
      const response = await analyticsAPI.getDetailedAnalytics({
        page,
        limit: 20
      });
      
      if (response.success && response.data) {
        setSessions(response.data.sessions);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  useEffect(() => {
    if (activeTab === 'sessions') {
      fetchSessions();
    }
  }, [activeTab]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'sessions', name: 'Sessions', icon: Users },
    { id: 'pages', name: 'Top Pages', icon: Eye },
    { id: 'devices', name: 'Devices', icon: Monitor },
    { id: 'geography', name: 'Geography', icon: Globe }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats ? formatNumber(stats.total.total_visitors) : '0'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                <ArrowUpRight className="h-4 w-4 inline mr-1" />
                +12% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats ? formatNumber(stats.total.total_sessions) : '0'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                <ArrowUpRight className="h-4 w-4 inline mr-1" />
                +8% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/20">
              <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Page Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats ? formatNumber(stats.total.total_page_views) : '0'}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                <ArrowUpRight className="h-4 w-4 inline mr-1" />
                +15% from last period
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/20">
              <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats ? stats.activeUsers : '0'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Last 30 minutes
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats ? formatNumber(stats.today.today_visitors) : '0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Visitors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats ? formatNumber(stats.today.today_sessions) : '0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats ? formatNumber(stats.today.today_page_views) : '0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Page Views</p>
          </div>
        </div>
      </motion.div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
        <div className="space-y-3">
          {stats?.topPages.slice(0, 5).map((page, index) => (
            <div key={page.page_path} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {page.page_title || page.page_path}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {page.page_path}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatNumber(page.total_views)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">views</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Device Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.deviceStats.map((device) => (
            <div key={device.device_type} className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-slate-700">
                {device.device_type === 'desktop' && <Monitor className="h-8 w-8 text-gray-600 dark:text-gray-400" />}
                {device.device_type === 'mobile' && <Smartphone className="h-8 w-8 text-gray-600 dark:text-gray-400" />}
                {device.device_type === 'tablet' && <Tablet className="h-8 w-8 text-gray-600 dark:text-gray-400" />}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatNumber(device.count)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {device.device_type}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="form-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <button
            onClick={() => fetchStats()}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pages
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.id.substring(0, 20)}...
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(session.start_time).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {session.first_name && session.last_name ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.first_name} {session.last_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {session.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">Anonymous</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {session.device_type === 'desktop' && <Monitor className="h-4 w-4 text-gray-400" />}
                      {session.device_type === 'mobile' && <Smartphone className="h-4 w-4 text-gray-400" />}
                      {session.device_type === 'tablet' && <Tablet className="h-4 w-4 text-gray-400" />}
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {session.device_type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {session.browser} on {session.os}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {session.city}, {session.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDuration(session.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {session.page_views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.is_bounce
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {session.is_bounce ? 'Bounce' : 'Engaged'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchSessions(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchSessions(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'sessions':
        return renderSessions();
      default:
        return (
          <div className="card p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {tabs.find(tab => tab.id === activeTab)?.name} Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This section is under development. Coming soon!
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-red-500 mb-4">
          <RefreshCw className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
          Error Loading Analytics
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button onClick={fetchStats} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track website performance and user engagement
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={fetchStats}
            className="btn-primary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {renderTabContent()}
    </div>
  );
};
