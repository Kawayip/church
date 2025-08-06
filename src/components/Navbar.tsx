import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Church, Play, Calendar, Users, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { getLogo } from '../utils/assets';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Events', path: '/events' },
    { name: 'Posts', path: '/posts' },
    { name: 'Resources', path: '/resources' },
    { name: 'Gallery', path: '/gallery' },
    // { name: 'Baptism', path: '/baptism' }, // Hidden for now
    { name: 'Give', path: '/e-giving' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={getLogo(theme)} 
              alt="Church Logo" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-3 ml-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
              <Link
                to="/live"
                className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200"
              >
                <Play className="h-4 w-4" />
                <span>Live</span>
              </Link>
              <Link
                to="/login"
                className="btn-primary text-sm px-4 py-2"
              >
                Member Portal
              </Link>
            </div>
          </div>

          {/* Tablet Navigation - Show fewer items */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-3 ml-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
              <Link
                to="/live"
                className="flex items-center space-x-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200"
              >
                <Play className="h-4 w-4" />
                <span>Live</span>
              </Link>
              <Link
                to="/login"
                className="btn-primary text-sm px-3 py-2"
              >
                Portal
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors duration-200 px-4 py-2 ${
                    isActive(item.path)
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <Link
                  to="/live"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-3 rounded-lg font-medium mb-3"
                >
                  <Play className="h-4 w-4" />
                  <span>Watch Live</span>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center block"
                >
                  Member Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      

    </nav>
  );
};