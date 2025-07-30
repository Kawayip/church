import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, Mail, Users, BookOpen, Heart } from 'lucide-react';

export const Baptism: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 section-accent text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Baptism at Mt. Olives SDA
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Begin your spiritual journey through the sacred ordinance of baptism
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors"
            >
              Learn More About Baptism
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* What is Baptism Section */}
      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              What is Baptism?
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Baptism is a sacred ordinance that symbolizes the death, burial, and resurrection of Jesus Christ. 
                  It represents our commitment to follow Christ and our acceptance of His grace and forgiveness.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Through baptism, we publicly declare our faith in Jesus Christ and our desire to live a new life 
                  in Him. It is a beautiful expression of our love for God and our commitment to His teachings.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  At Mt. Olives SDA Church, we practice baptism by immersion, following the biblical example 
                  and the teachings of the Seventh-day Adventist Church.
                </p>
              </div>
              <div className="card p-8">
                <h3 className="text-2xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">Biblical Foundation</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="text-emerald-500 dark:text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Matthew 28:19-20</p>
                      <p className="text-gray-600 dark:text-gray-300">"Go therefore and make disciples of all nations, baptizing them..."</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="text-emerald-500 dark:text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Romans 6:3-4</p>
                      <p className="text-gray-600 dark:text-gray-300">"Do you not know that all of us who have been baptized..."</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="text-emerald-500 dark:text-emerald-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Acts 2:38</p>
                      <p className="text-gray-600 dark:text-gray-300">"Repent and be baptized every one of you..."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Baptism Process Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              The Baptism Process
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="card p-6 text-center"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Bible Study</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Begin with comprehensive Bible studies to understand the fundamental teachings 
                  of the Seventh-day Adventist Church and prepare for baptism.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="card p-6 text-center"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Decision & Preparation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Make a personal decision to follow Christ and prepare spiritually 
                  for the baptism ceremony through prayer and reflection.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="card p-6 text-center"
              >
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Baptism Ceremony</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Participate in a beautiful baptism ceremony where you publicly declare 
                  your faith and commitment to Christ through immersion.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Baptism Requirements
            </h2>
            <div className="card p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-emerald-600 dark:text-emerald-400">Spiritual Requirements</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Acceptance of Jesus Christ as personal Savior</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Understanding of fundamental Bible teachings</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Commitment to live according to God's Word</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Desire to become a member of the church</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-emerald-600 dark:text-emerald-400">Practical Requirements</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Completion of baptismal classes</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Baptismal interview with pastor</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Appropriate baptismal attire</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">Arrangement of baptismal date</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 section-accent text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              If you're interested in baptism or have questions about the process, 
              we'd love to hear from you. Contact us to learn more.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-emerald-100">(555) 123-4567</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-emerald-100">baptism@mtolives.org</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-emerald-100">123 Church Street</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-colors"
            >
              Contact Us About Baptism
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 section-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  How long does the baptism process take?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The baptism process typically takes 3-6 months, including Bible studies, 
                  preparation, and the actual baptism ceremony.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  What should I wear for baptism?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We provide baptismal robes for the ceremony. You'll need to bring 
                  appropriate undergarments and a change of clothes.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Can children be baptized?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Children can be baptized when they are old enough to understand 
                  the significance of baptism and make a personal decision for Christ.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  What happens after baptism?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  After baptism, you'll be welcomed as a member of the church and 
                  can participate in all church activities and ministries.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}; 