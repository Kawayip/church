import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Calendar, Users, Clock, ChevronRight } from 'lucide-react';

export const SabbathSchool: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('current');

  const currentLesson = {
    quarter: 'First Quarter 2025',
    title: 'The Book of Acts: The Gospel to All the World',
    week: 'Week 1',
    lessonTitle: 'The Promise of the Spirit',
    date: 'January 4, 2025',
    memoryVerse: '"But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth." - Acts 1:8',
    keyThought: 'The Holy Spirit empowers believers to be effective witnesses for Christ.',
    downloadUrl: '#'
  };

  const classes = [
    {
      name: 'Adult Class',
      teacher: 'Elder Paul Ssemwogerere',
      time: '9:00 - 10:00 AM',
      location: 'Main Sanctuary',
      description: 'In-depth Bible study for adults using the quarterly lesson guide.',
      ageGroup: '18+ years'
    },
    {
      name: 'Youth Class',
      teacher: 'Elder Sarah Namukasa',
      time: '9:00 - 10:00 AM',
      location: 'Youth Hall',
      description: 'Interactive Bible study designed specifically for teenagers.',
      ageGroup: '13-17 years'
    },
    {
      name: 'Junior Class',
      teacher: 'Teacher Ruth Namutebi',
      time: '9:00 - 10:00 AM',
      location: 'Children\'s Room',
      description: 'Fun and engaging Bible stories for children.',
      ageGroup: '6-12 years'
    },
    {
      name: 'Primary Class',
      teacher: 'Teacher Grace Nakato',
      time: '9:00 - 10:00 AM',
      location: 'Primary Room',
      description: 'Simple Bible stories and activities for young children.',
      ageGroup: '3-5 years'
    }
  ];

  const quarters = [
    {
      id: 'current',
      title: 'First Quarter 2025',
      subtitle: 'The Book of Acts: The Gospel to All the World',
      status: 'Current',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'q4-2024',
      title: 'Fourth Quarter 2024',
      subtitle: 'The Book of Revelation',
      status: 'Completed',
      color: 'bg-gray-100 text-gray-600'
    },
    {
      id: 'q3-2024',
      title: 'Third Quarter 2024',
      subtitle: 'The Gospel of Mark',
      status: 'Completed',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const weeklyLessons = [
    { week: 1, title: 'The Promise of the Spirit', date: 'Jan 4', status: 'current' },
    { week: 2, title: 'Pentecost', date: 'Jan 11', status: 'upcoming' },
    { week: 3, title: 'Life in the Early Church', date: 'Jan 18', status: 'upcoming' },
    { week: 4, title: 'The First Church Leaders', date: 'Jan 25', status: 'upcoming' },
    { week: 5, title: 'The Conversion of Paul', date: 'Feb 1', status: 'upcoming' },
    { week: 6, title: 'Peter\'s Ministry', date: 'Feb 8', status: 'upcoming' }
  ];

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
              Sabbath <span className="text-gradient">School</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join us every Sabbath morning for interactive Bible study. Grow in faith through 
              systematic study of God's Word with fellow believers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Current Lesson Highlight */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="mb-4">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                    This Week's Lesson
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{currentLesson.lessonTitle}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{currentLesson.quarter} • {currentLesson.week}</p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{currentLesson.keyThought}</p>
                
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-600 dark:border-emerald-400 p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Memory Verse</h4>
                  <p className="text-gray-700 dark:text-gray-300 italic">{currentLesson.memoryVerse}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="btn-primary flex items-center justify-center">
                    <Download className="mr-2 h-5 w-5" />
                    Download Lesson
                  </button>
                  <button className="btn-secondary">
                    View Study Guide
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/8112175/pexels-photo-8112175.jpeg"
                  alt="Bible Study"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl flex items-end">
                  <div className="p-6 text-white">
                    <p className="text-sm opacity-90">Study Date</p>
                    <p className="text-lg font-semibold">{currentLesson.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Classes */}
      <section className="py-20 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Sabbath School Classes</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We have classes for every age group, each designed to meet the spiritual needs 
              and learning styles of different age groups.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {classes.map((classInfo, index) => (
              <motion.div
                key={classInfo.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6 hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{classInfo.name}</h3>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
                    {classInfo.ageGroup}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">{classInfo.description}</p>
                
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                    <span className="font-medium">Teacher:</span>
                    <span className="ml-1">{classInfo.teacher}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-1">{classInfo.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-1">{classInfo.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quarterly Lessons */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Quarterly Lessons</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Access current and past quarterly lesson guides for personal study and preparation.
            </p>
          </motion.div>

          {/* Quarter Selection */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {quarters.map((quarter) => (
              <button
                key={quarter.id}
                onClick={() => setSelectedQuarter(quarter.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedQuarter === quarter.id
                    ? 'btn-primary'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">{quarter.title}</div>
                  <div className="text-sm opacity-75">{quarter.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Weekly Lessons */}
          <div className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weekly Lessons</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeklyLessons.map((lesson) => (
                <div
                  key={lesson.week}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    lesson.status === 'current'
                      ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Week {lesson.week}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-500">{lesson.date}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{lesson.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lesson.status === 'current'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {lesson.status === 'current' ? 'Current' : 'Upcoming'}
                    </span>
                    <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            <h2 className="text-3xl font-bold mb-4">Join Us This Sabbath</h2>
            <p className="text-xl mb-8 text-emerald-100">
              Experience the joy of studying God's Word together. All are welcome, 
              regardless of your level of Bible knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200">
                Plan Your Visit
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-200">
                Download Study Guide
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};