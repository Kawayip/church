import * as React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Heart, CreditCard, BookOpen, Users, Bell, Settings } from 'lucide-react';

export const MemberPortal: React.FC = () => {
  const memberData = {
    name: 'John Mukasa',
    memberSince: '2020',
    department: 'Youth Ministry',
    givingTotal: '2,450,000'
  };

  const quickActions = [
    { icon: CreditCard, title: 'Make a Donation', description: 'Give your tithe or offering online', link: '/e-giving' },
    { icon: Calendar, title: 'View Events', description: 'See upcoming church events', link: '/events' },
    { icon: BookOpen, title: 'Access Resources', description: 'Download sermons and study materials', link: '/resources' },
    { icon: Heart, title: 'Prayer Request', description: 'Submit a prayer request', link: '/contact' }
  ];

  return (
    <div className="pt-16 bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <section className="py-12 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, <span className="text-emerald-600 dark:text-emerald-400">{memberData.name}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">Member since {memberData.memberSince} • {memberData.department}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.a
                        key={action.title}
                        href={action.link}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="card p-6 hover:scale-105 transition-all duration-300 group block"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{action.description}</p>
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                <div className="card p-6">
                  <div className="space-y-4">
                    {[
                      { date: '2025-01-01', action: 'Attended Sabbath Worship Service', type: 'attendance' },
                      { date: '2024-12-28', action: 'Made tithe donation - UGX 100,000', type: 'giving' },
                      { date: '2024-12-25', action: 'Downloaded Christmas Program Guide', type: 'resource' },
                      { date: '2024-12-20', action: 'Registered for Youth Retreat', type: 'event' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.type === 'giving' ? 'bg-emerald-500 dark:bg-emerald-400' :
                          activity.type === 'attendance' ? 'bg-blue-500 dark:bg-blue-400' :
                          activity.type === 'resource' ? 'bg-purple-500 dark:bg-purple-400' : 'bg-amber-500 dark:bg-amber-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">{activity.action}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Member Stats */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total Giving (2024)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">UGX {memberData.givingTotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Services Attended</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">48/52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Ministry Involvement</span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">Active</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upcoming Events</h3>
                <div className="space-y-4">
                  {[
                    { date: 'Jan 4', title: 'Sabbath Worship', time: '9:00 AM' },
                    { date: 'Jan 8', title: 'Prayer Meeting', time: '7:00 PM' },
                    { date: 'Jan 12', title: 'Health Fair', time: '10:00 AM' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">{event.date}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900 dark:text-white font-medium">{event.title}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer Requests */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Submit Prayer Request</h3>
                <textarea
                  placeholder="Share your prayer request..."
                  className="form-input resize-none"
                  rows={3}
                ></textarea>
                <button className="w-full mt-4 btn-primary">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};