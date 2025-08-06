import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Clock, Calendar, Twitter, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLogo } from '../utils/assets';
import { useTheme } from '../contexts/ThemeContext';

export const Footer: React.FC = () => {
  const { theme } = useTheme();

  // Static latest news data (no backend dependency)
  const latestNews = {
    title: "Women Ministries Emphasis Day",
    date: "June 14th, 2025",
    category: "Ministries",
    isFeatured: true
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content - Table-like Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: ABOUT US */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-4 border-b border-white/30 pb-2">ABOUT US</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                About Mt Olives SDA Church
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Our Mission & Vision
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Our Beliefs
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Leadership Team
              </Link>
              <Link to="/gallery" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Photo Gallery
              </Link>
              <Link to="/live" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Live Stream
              </Link>
            </div>
          </div>

          {/* Column 2: RESOURCES */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-4 border-b border-white/30 pb-2">RESOURCES</h4>
            <div className="space-y-2 text-sm">
              <Link to="/sermons" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Sermons & Media
              </Link>
              <Link to="/resources" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Weekly Bulletins
              </Link>
              <Link to="/resources" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Study Materials
              </Link>
              <Link to="/sabbath-school" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Sabbath School
              </Link>
              <Link to="/resources" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Daily Quotes
              </Link>
              <Link to="/resources" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Downloads
              </Link>
            </div>
          </div>

          {/* Column 3: GET INVOLVED */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-4 border-b border-white/30 pb-2">GET INVOLVED</h4>
            <div className="space-y-2 text-sm">
              <Link to="/ministries" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Join a Ministry
              </Link>
              <Link to="/events" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Upcoming Events
              </Link>
              <Link to="/e-giving" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Donate / Support
              </Link>
              <Link to="/ministries" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Volunteer Opportunities
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Contact Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Prayer Requests
              </Link>
            </div>
          </div>

          {/* Column 4: SERVICES & LATEST NEWS */}
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-lg mb-4 border-b border-white/30 pb-2">SERVICES & NEWS</h4>
            <div className="space-y-2 text-sm">
              <Link to="/baptism" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Baptism Request
              </Link>
              <Link to="/login" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Member Portal
              </Link>
              <Link to="/live" className="block text-gray-300 hover:text-emerald-400 transition-colors">
                Watch Live
              </Link>
              <div className="pt-2">
                <div className="block bg-slate-800 rounded p-3 hover:bg-slate-700 transition-colors">
                  <div className="font-medium text-white mb-1 line-clamp-2">
                    {latestNews.title}
                  </div>
                  <div className="text-gray-400 text-xs flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {latestNews.date}
                  </div>
                  {latestNews.isFeatured && (
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                      <span className="text-xs text-white">FEATURED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-8">
          <a href="#" className="w-10 h-10 border-2 border-gray-600 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
            <Youtube className="w-5 h-5 text-gray-300" />
          </a>
          <a href="#" className="w-10 h-10 border-2 border-gray-600 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
            <Facebook className="w-5 h-5 text-gray-300" />
          </a>
          <a href="#" className="w-10 h-10 border-2 border-gray-600 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
            <Instagram className="w-5 h-5 text-gray-300" />
          </a>
          <a href="#" className="w-10 h-10 border-2 border-gray-600 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
            <Twitter className="w-5 h-5 text-gray-300" />
          </a>
          <a href="#" className="w-10 h-10 border-2 border-gray-600 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
            <div className="w-5 h-5 text-gray-300 text-xs font-bold">T</div>
          </a>
          <a href="#" className="w-10 h-10 border-2 border-gray-600 rounded-lg flex items-center justify-center hover:bg-slate-800 transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-300" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4 text-sm">
              <Link to="/terms" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Terms of service
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-emerald-400 transition-colors">
                Privacy policy
              </Link>
            </div>
            <div className="text-center text-sm">
              <p className="text-gray-300">© 2025 Mt Olives SDA Church.</p>
              <p className="text-gray-300">All rights reserved.</p>
            </div>
            <div className="text-sm text-gray-300">
              Powered By <a href="https://codecraftersko.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-emerald-400 transition-colors">Code Crafters Ug.</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};