import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, ArrowLeft, Share2, 
  Users, Tag, Loader2, ExternalLink, Phone, Mail 
} from 'lucide-react';
import { format } from 'date-fns';
import { eventsAPI, Event } from '../services/api';
import { SEO } from '../components/SEO';

export const SingleEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (id) {
      fetchEvent(parseInt(id));
    }
  }, [id]);

  const fetchEvent = async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsAPI.getById(eventId);
      
      if (response.success && response.data) {
        setEvent(response.data);
        fetchRelatedEvents(response.data.event_type, eventId);
      } else {
        setError(response.message || 'Event not found');
      }
    } catch (err) {
      setError('Failed to load event');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedEvents = async (eventType: string, currentEventId: number) => {
    try {
      const response = await eventsAPI.getAll({ type: eventType, limit: 3 });
      if (response.success && response.data) {
        // Filter out the current event and limit to 3
        const filtered = response.data
          .filter(e => e.id !== currentEventId)
          .slice(0, 3);
        setRelatedEvents(filtered);
      }
    } catch (err) {
      console.error('Error fetching related events:', err);
    }
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

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading event...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Event Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/events')}
              className="btn-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-slate-900">
      {event && (
        <SEO
          title={`${event.title} - Mt. Olives SDA Church`}
          description={event.description || `Join us for ${event.title} at Mt. Olives SDA Church. ${event.event_date ? `Date: ${format(new Date(event.event_date), 'MMMM d, yyyy')}` : ''}`}
          image={event.image_url || eventsAPI.getImageUrl(event.id)}
          type="event"
          publishedTime={event.created_at}
          modifiedTime={event.updated_at}
          tags={[event.event_type, 'church event', 'Mt. Olives SDA']}
        />
      )}
      {/* Hero Section */}
      <section className="relative">
        {/* Event Image */}
        {(event.image_url || event.image_data) ? (
          <div className="h-96 md:h-[500px] relative overflow-hidden">
            <img
              src={event.image_url || eventsAPI.getImageUrl(event.id)}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-96 md:h-[500px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-white" />
          </div>
        )}

        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/events')}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Share Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleShare}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Featured Badge */}
        {event.is_featured && (
          <div className="absolute top-4 left-16">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured Event
            </span>
          </div>
        )}
      </section>

      {/* Event Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Event Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.event_type)}`}>
                      {getEventTypeLabel(event.event_type)}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {event.title}
                  </h1>
                  {event.description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Event Details */}
                <div className="card p-6 mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(event.event_date), 'cccc')}
                        </p>
                      </div>
                    </div>

                    {event.event_time && (
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {formatTime(event.event_time)}
                            {event.end_time && ` - ${formatTime(event.end_time)}`}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Duration: {event.end_time ? 
                              `${Math.round((new Date(`2000-01-01T${event.end_time}`).getTime() - new Date(`2000-01-01T${event.event_time}`).getTime()) / (1000 * 60 * 60))} hours` : 
                              'TBD'
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {event.location && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{event.location}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Event Location</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Event Type</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {getEventTypeLabel(event.event_type)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                      <span className="text-gray-600 dark:text-gray-400">Featured Event</span>
                      <span className={`font-medium ${event.is_featured ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {event.is_featured ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-600 dark:text-gray-400">Created</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {format(new Date(event.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Quick Actions */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full btn-primary">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </button>
                    <button 
                      onClick={handleShare}
                      className="w-full btn-secondary"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Event
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">+256 123 456 789</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">info@church.com</span>
                    </div>
                  </div>
                </div>

                {/* Related Events */}
                {relatedEvents.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Events</h3>
                    <div className="space-y-4">
                      {relatedEvents.map((relatedEvent) => (
                        <div
                          key={relatedEvent.id}
                          onClick={() => navigate(`/events/${relatedEvent.id}`)}
                          className="p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                            {relatedEvent.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {format(new Date(relatedEvent.event_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 