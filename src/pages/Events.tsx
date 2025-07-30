import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { eventsAPI, Event } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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



  const categories = [
    { id: 'all', name: 'All Events', color: 'emerald' },
    { id: 'service', name: 'Worship Service', color: 'blue' },
    { id: 'meeting', name: 'Meeting', color: 'green' },
    { id: 'outreach', name: 'Outreach', color: 'purple' },
    { id: 'youth', name: 'Youth Event', color: 'pink' },
    { id: 'special', name: 'Special Event', color: 'amber' }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.event_type === selectedCategory);

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
              Upcoming <span className="text-gradient">Events</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join us for worship, fellowship, and spiritual growth opportunities throughout the month.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <span className="text-gray-900 dark:text-white font-medium">Filter by category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'btn-primary'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading events...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Error loading events</h3>
              <p className="text-gray-500 dark:text-gray-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="card overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {(event.image_url || event.image_data) ? (
                        <img
                          src={event.image_url || eventsAPI.getImageUrl(event.id)}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Show fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center ${(event.image_url || event.image_data) ? 'hidden' : ''}`}>
                        <Calendar className="h-12 w-12 text-white" />
                      </div>
                      
                      {event.is_featured && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                          {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                        </div>
                        {event.event_time && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                            {event.event_time}
                            {event.end_time && ` - ${event.end_time}`}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                            {event.location}
                          </div>
                        )}
                      </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button 
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="w-full btn-primary text-sm px-4 py-2"
                    >
                      Learn More
                    </button>
                  </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {selectedCategory === 'all' ? 'No events found' : 'No events in this category'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    {selectedCategory === 'all' 
                      ? 'Check back later for upcoming events.' 
                      : 'Try selecting a different category to see more events.'
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 section-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Never miss an event! Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-input"
              />
              <button className="btn-primary px-6 py-3">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};