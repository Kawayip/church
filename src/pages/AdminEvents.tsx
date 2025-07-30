import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Search, Filter, Calendar, MapPin, Tag, Loader2, Clock } from 'lucide-react';
import { eventsAPI, Event } from '../services/api';
import { EventModal } from '../components/EventModal';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.getAll();
      
      if (response.success && response.data) {
        setEvents(response.data);
      } else {
        setError(response.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await eventsAPI.delete(id);
      
      if (response.success) {
        setEvents(prev => prev.filter(event => event.id !== id));
      } else {
        alert(response.message || 'Failed to delete event');
      }
    } catch (err) {
      alert('Failed to delete event');
      console.error('Error deleting event:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    fetchEvents();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    const matchesFeatured = featuredFilter === 'all' || 
                           (featuredFilter === 'featured' && event.is_featured) ||
                           (featuredFilter === 'not-featured' && !event.is_featured);
    
    return matchesSearch && matchesType && matchesFeatured;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      service: 'Worship Service',
      meeting: 'Meeting',
      outreach: 'Outreach',
      youth: 'Youth Event',
      special: 'Special Event'
    };
    return typeLabels[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      service: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      meeting: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      outreach: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      youth: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      special: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Events Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage church events and activities</p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="service">Worship Service</option>
              <option value="meeting">Meeting</option>
              <option value="outreach">Outreach</option>
              <option value="youth">Youth Event</option>
              <option value="special">Special Event</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="all">All Events</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="card p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || typeFilter !== 'all' || featuredFilter !== 'all' ? 'No events found' : 'No events yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || typeFilter !== 'all' || featuredFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first event'
            }
          </p>
          {!searchTerm && typeFilter === 'all' && featuredFilter === 'all' && (
            <button
              onClick={handleCreateEvent}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Event Image */}
              {(event.image_url || event.image_data) && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.image_url || eventsAPI.getImageUrl(event.id)}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide image if it fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Event Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.event_type)}`}>
                        {getEventTypeLabel(event.event_type)}
                      </span>
                      {event.is_featured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.event_date)}
                  </div>
                  {event.event_time && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(event.event_time)}
                      {event.end_time && ` - ${formatTime(event.end_time)}`}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="Edit event"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      disabled={deleteLoading === event.id}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete event"
                    >
                      {deleteLoading === event.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {formatDate(event.created_at)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        event={selectedEvent}
      />
    </div>
  );
}; 