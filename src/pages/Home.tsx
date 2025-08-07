import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Heart, BookOpen, ArrowRight, Play, Clock, MapPin, Phone, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getChurchIcon, getTeamImage, getBackgroundImage } from '../utils/assets';
import { useState, useEffect } from 'react';
import { eventsAPI, Event } from '../services/api';
import { format } from 'date-fns';
import { SEO, SEOConfigs } from '../components/SEO';

export const Home: React.FC = () => {
  // Background carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Events state
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  
  // Church icon state
  const [churchIconLoaded, setChurchIconLoaded] = useState(false);
  
  // Background images for carousel
  // Using public folder images for production compatibility
  const backgroundImages = [
    getBackgroundImage('hero1'),
    getBackgroundImage('hero2'),
    getBackgroundImage('hero3')
  ];

  // Test if images are loading
  useEffect(() => {
    backgroundImages.forEach((url, index) => {
      const img = new Image();
      img.onload = () => console.log(`Image ${index + 1} loaded successfully`);
      img.onerror = () => console.error(`Image ${index + 1} failed to load:`, url);
      img.src = url;
    });

    // Test church icon loading
    const churchIconUrl = getChurchIcon();
    console.log('Church icon URL:', churchIconUrl);
    const churchIconImg = new Image();
    churchIconImg.onload = () => {
      console.log('Church icon loaded successfully');
      setChurchIconLoaded(true);
    };
    churchIconImg.onerror = () => {
      console.error('Church icon failed to load:', churchIconUrl);
    };
    churchIconImg.src = churchIconUrl;
  }, []);

  // Fallback background color if images fail to load
  const fallbackBackground = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Fetch upcoming events
  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      
      // First try to get upcoming events
      const response = await eventsAPI.getUpcoming(3);
      
      if (response.success && response.data) {
        console.log('Upcoming events fetched:', response.data.length, 'events');
        setUpcomingEvents(response.data);
      } else {
        // If upcoming events fail, try to get all events and filter for upcoming ones
        console.log('Upcoming events failed, trying all events...');
        const allEventsResponse = await eventsAPI.getAll({ limit: 10 });
        
        if (allEventsResponse.success && allEventsResponse.data) {
          const now = new Date();
          const upcoming = allEventsResponse.data
            .filter(event => new Date(event.event_date) > now)
            .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
            .slice(0, 3);
          
          console.log('Filtered upcoming events:', upcoming.length, 'events');
          setUpcomingEvents(upcoming);
        } else {
          setEventsError(allEventsResponse.message || 'Failed to fetch events');
        }
      }
    } catch (err) {
      setEventsError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setEventsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      icon: BookOpen,
      title: 'Sabbath School',
      description: 'Interactive Bible study for all ages every Sabbath morning',
      time: 'Sat 9:00 AM',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Users,
      title: 'Divine Service',
      description: 'Inspiring worship with music, prayer, and biblical preaching',
      time: 'Sat 11:00 AM',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      icon: Heart,
      title: 'Midweek Fellowship',
      description: 'Tuesday prayer and Bible study for spiritual growth',
      time: 'Tue 7:00 PM',
      color: 'from-purple-500 to-pink-500'
    }
  ];



  return (
    <div className="pt-16">
      <SEO {...SEOConfigs.home} />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center section-light overflow-hidden mb-8 md:mb-12">
        {/* Background Image Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
              background: `url(${backgroundImages[currentImageIndex]}) center/cover, ${fallbackBackground}`
            }}
          />
        </AnimatePresence>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        

        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div 
              className="w-24 h-24 mx-auto mb-8 mt-8 flex items-center justify-center"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                duration: 1.2, 
                type: "spring", 
                stiffness: 100,
                delay: 0.2 
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <img 
                src={getChurchIcon()} 
                alt="Church Icon" 
                className="h-24 w-24 object-contain"
              />
            </motion.div>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl heading-primary text-white mb-4 md:mb-6 hero-text-shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl"
              >
                Welcome to
              </motion.span>
              <motion.span 
                className="block text-white hero-text-shadow-lg hero-text-glow text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                Mt. Olives SDA Church
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-body text-white mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed hero-text-shadow px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              A vibrant Seventh-day Adventist community in Naalya, dedicated to worship, 
              fellowship, and service. Join us as we grow together in faith and love.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap justify-center items-center gap-4 mb-12"
          >
            {/* Learn More Button - Floating Up and Down */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [-2, 2, -2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: 0,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/about"
                className="btn-primary flex items-center justify-center group whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Watch Live Button - Floating Side to Side */}
            <motion.div
              animate={{
                x: [-8, 8, -8],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.1,
                x: 0,
                y: 0,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/live"
                className="flex items-center justify-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                <Play className="h-5 w-5" />
                <span>Watch Live</span>
              </Link>
            </motion.div>

            {/* Upcoming Events Button - Floating in Circle */}
            <motion.div
              animate={{
                x: [0, 5, 0, -5, 0],
                y: [0, -5, 0, 5, 0],
                rotate: [0, 1, 0, -1, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.1,
                x: 0,
                y: 0,
                rotate: 0,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/events"
                className="btn-secondary whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                Upcoming Events
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="card p-6 text-center">
              <Clock className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Service Times</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Sabbath: 9:00 AM to 04:00 PM</p>
            </div>
            <div className="card p-6 text-center">
              <MapPin className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Opolot Close, Ndagire Rd, Wakiso</p>
            </div>
            <div className="card p-6 text-center">
              <Phone className="h-8 w-8 text-emerald-500 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">+256 700 123 456</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Running Cards */}
      <section className="py-8 md:py-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 overflow-hidden mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">What's Happening</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Stay updated with our latest activities</p>
          </motion.div>
          
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {/* Running Card 1 */}
            <Link to="/events">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-shrink-0 w-72 md:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Check out our latest events</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-emerald-500" />
                </div>
              </motion.div>
            </Link>

            {/* Running Card 2 */}
            <Link to="/ministries">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Ministries</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get involved in our ministries</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-500" />
                </div>
              </motion.div>
            </Link>

            {/* Running Card 3 */}
            <Link to="/resources">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Resources</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Access study materials</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-amber-500" />
                </div>
              </motion.div>
            </Link>

            {/* Running Card 4 */}
            <Link to="/e-giving">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Give</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Support our mission</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-500" />
                </div>
              </motion.div>
            </Link>

            {/* Running Card 5 */}
            <Link to="/live">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex-shrink-0 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Live Stream</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Join us online</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-red-500" />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Join Our Weekly Services</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Experience meaningful worship and grow in faith with our church family every week
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-6 md:p-8 hover:scale-105 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{service.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pastor's Message Section */}
      <section className="py-12 md:py-20 section-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img 
                    src={getTeamImage('pastor')} 
                    alt="Pastor Kiragga Christo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">A Message from Our Pastor</h2>
              <blockquote className="relative mb-8">
                <div className="absolute -left-4 top-0 text-6xl text-white/20 font-serif">"</div>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-emerald-100 pl-4 md:pl-8 italic">
                To have a church that is mission-oriented, understanding the significance of these end times, is a calling we must embrace wholeheartedly. As the hymn reminds us, ‘Let us labor for the Master from dawn till setting sun; let us speak of His wondrous love and care.’ When the Lord returns, may we hear those blessed words: ‘Well done, good and faithful servant.’

<br></br>May God’s blessings be upon us all as we step into a new year, striving for a renewed spirit and a deeper relationship with Him. Wishing you a happy new year and a transformed, joyful ‘new you’ in Christ.
                </p>
                <div className="absolute -right-4 bottom-0 text-6xl text-white/20 font-serif">"</div>
              </blockquote>
              <div className="border-l-4 border-emerald-400 pl-6">
                <p className="text-lg font-semibold text-white">Pr. Kiragga Christo</p>
                <p className="text-emerald-200">Kira Central District</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 md:py-20 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Upcoming Events</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Join us for special services, community outreach, and fellowship opportunities
            </p>
            {upcomingEvents.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Showing {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading events...</span>
            </div>
          ) : eventsError ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Error loading events</h3>
              <p className="text-gray-500 dark:text-gray-500">{eventsError}</p>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No upcoming events</h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">Check back later for upcoming events.</p>
              <Link to="/events" className="btn-primary">
                View All Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card overflow-hidden hover:scale-105 transition-all duration-300 group cursor-pointer"
                  onClick={() => window.location.href = `/events/${event.id}`}
                >
                  {/* Event Image */}
                  {(event.image_url || event.image_data) ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image_url || eventsAPI.getImageUrl(event.id)}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                        {format(new Date(event.event_date), 'MMM d')}
                      </div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {event.event_type === 'service' ? 'Worship Service' :
                         event.event_type === 'meeting' ? 'Meeting' :
                         event.event_type === 'outreach' ? 'Outreach' :
                         event.event_type === 'youth' ? 'Youth Event' :
                         event.event_type === 'special' ? 'Special Event' : event.event_type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    <div className="space-y-2">
                      {event.event_time && (
                        <p className="text-gray-600 dark:text-gray-300 flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          {new Date(`2000-01-01T${event.event_time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-gray-600 dark:text-gray-300 flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="btn-primary"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Our Mission</h2>
            <blockquote className="text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed italic">
              "To make disciples of all nations, baptizing them in the name of the Father 
              and of the Son and of the Holy Spirit, and teaching them to obey everything 
              I have commanded you."
            </blockquote>
            <cite className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg">Matthew 28:19-20</cite>
            
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">W</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Worship</h3>
                  <p className="text-gray-600 dark:text-gray-300">Glorifying God through meaningful worship and praise</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">F</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fellowship</h3>
                  <p className="text-gray-600 dark:text-gray-300">Building strong Christian community and relationships</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">S</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Service</h3>
                  <p className="text-gray-600 dark:text-gray-300">Serving our community with Christ's love and compassion</p>
                </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 section-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Church Family?</h2>
            <p className="text-xl mb-8 text-emerald-100">
              Take the next step in your spiritual journey with us. We'd love to welcome you home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200"
              >
                Plan Your Visit
              </Link>
              <Link
                to="/baptism"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-200"
              >
                Request Baptism
              </Link>
              <Link
                to="/e-giving"
                className="bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-200"
              >
                Support Our Ministry
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};