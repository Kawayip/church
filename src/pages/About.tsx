import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, BookOpen, Globe, Download, FileText } from 'lucide-react';
import { getTeamImage, getUIImage } from '../utils/assets';

export const About: React.FC = () => {

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
              About <span className="text-gradient">Our Church</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our history, mission, and the beliefs that guide our community 
              as we serve God and our neighbors in Naalya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p>
                  Mt. Olives Seventh-day Adventist Church was established in Naalya with a vision 
                  to create a warm, welcoming community where people from all walks of life could 
                  come together to worship, learn, and grow in their relationship with Jesus Christ.
                </p>
                <p>
                  Since our founding, we have been committed to sharing the love of Christ through 
                  meaningful worship services, Bible study programs, community outreach initiatives, 
                  and fellowship opportunities that strengthen both individual faith and community bonds.
                </p>
                <p>
                  Today, we continue to serve as a beacon of hope in Naalya, offering spiritual 
                  guidance, practical support, and a place where everyone can find belonging 
                  in God's family.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-primary rounded-2xl p-8 text-center">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">25+</div>
                    <div className="text-emerald-100">Years of Service</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">500+</div>
                    <div className="text-emerald-100">Active Members</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">15</div>
                    <div className="text-emerald-100">Ministries</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">30</div>
                    <div className="text-emerald-100">Baptisms This Year</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Congregations */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Congregations</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Mt. Olives is home to three vibrant congregations, each serving different age groups 
              and spiritual needs while sharing the same mission of spreading God's love.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('adults')} 
                  alt="Main Adult Church"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-3">Main Adult Church</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our primary congregation for adults, featuring the main Sabbath worship service, 
                  in-depth Bible study, and mature spiritual fellowship for all adult members.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('ambassadors')} 
                  alt="Ambassadors Church"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-3">Ambassadors Church</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A dynamic congregation focused on young adults and youth, featuring contemporary 
                  worship, relevant teaching, and engaging activities that speak to modern challenges.
                </p>
              </div>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('children')} 
                  alt="Children's Church"
                  className="w-full h-full object-cover"
                />
                    </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-3">Children's Church</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  A special congregation designed for our youngest members, featuring age-appropriate 
                  worship, interactive Bible stories, and fun activities that make learning about God exciting.
                </p>
                </div>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Community Life */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Community Life</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the vibrant community life that makes Mt. Olives a special place 
              where everyone feels welcome and valued.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="h-80 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl overflow-hidden">
                <img 
                  src={getUIImage('worship')} 
                  alt="Worship Service"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Meaningful Worship</h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Our worship services are a blend of traditional hymns and contemporary praise, 
                  creating an atmosphere where everyone can connect with God in their own way.
                </p>
                <p>
                  Each service is carefully planned to inspire, educate, and encourage 
                  spiritual growth through powerful sermons, beautiful music, and heartfelt prayers.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">Traditional & Contemporary Music</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">Bible-Based Preaching</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Fellowship & Connection</h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Beyond Sabbath worship, our church family stays connected through various 
                  fellowship activities, study groups, and community events.
                </p>
                <p>
                  Whether it's sharing a meal together, participating in Bible study, 
                  or serving our community, there are countless opportunities to build 
                  meaningful relationships and grow in faith together.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">Weekly Bible Study Groups</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium">Community Service Projects</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="h-80 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl overflow-hidden">
                <img 
                  src={getUIImage('fellowship')} 
                  alt="Fellowship Activities"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Church Activities & Events */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Church Activities & Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From worship services to community outreach, discover the various activities 
              that keep our church family engaged and growing together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('sabbathschool1')} 
                  alt="Sabbath School"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Sabbath School</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Interactive Bible study classes for all age groups every Saturday morning.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('youth')} 
                  alt="Youth Programs"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Youth Programs</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Engaging activities and programs designed specifically for our young members.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('outreach')} 
                  alt="Community Outreach"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Community Outreach</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Serving our local community through various outreach and service projects.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <img 
                  src={getUIImage('fellowship')} 
                  alt="Fellowship Events"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Fellowship Events</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Regular social gatherings and events that strengthen our church family bonds.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Church Leadership</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Meet our dedicated leaders who guide and serve our church family with wisdom and compassion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Pr. Christo Kiragga', role: 'Church Pastor', imageId: 'pastor' },
              { name: 'Elder Vincent Zirimwabagabo', role: 'FIrst Elder', imageId: 'elder' },
              { name: 'Ms. Harriet Assimwe', role: 'Church Clerk', imageId: 'deacon' }
            ].map((leader, index) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card p-6 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 overflow-hidden">
                  <img src={getTeamImage(leader.imageId)} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{leader.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400 mb-4">{leader.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Dedicated to serving our church family and community with passion and faith.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Know Your Leaders */}
      <section className="py-20 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Know Your Leaders</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get to know our church leaders better with detailed information about their roles, 
              responsibilities, and how they serve our church family.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Leadership Guide</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our comprehensive leadership guide provides detailed information about each leader's 
                  role, responsibilities, and how they contribute to our church's mission and vision. 
                  Learn about their backgrounds, areas of expertise, and how you can connect with them.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Detailed leader profiles and backgrounds</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Role descriptions and responsibilities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">Contact information and office hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-300">How to get involved in church leadership</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Download className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Download Leadership Guide</h3>
                <p className="text-emerald-100 mb-8">
                  Get the complete "Know Your Leaders" guide in PDF format. 
                  Perfect for reference and sharing with new members.
                </p>
                <a
                  href="/src/assets/documents/Know-Your-Leaders-Guide.pdf"
                  download="Know-Your-Leaders-Guide.pdf"
                  className="inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-200"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Guide
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 section-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                To be a thriving, Christ-centered community that transforms lives through 
                the power of God's love, preparing people for Jesus' second coming while 
                serving our local and global community with compassion and excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                To glorify God by sharing the everlasting gospel of Jesus Christ, 
                nurturing spiritual growth through worship and discipleship, and 
                demonstrating God's love through service to all people in our community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};