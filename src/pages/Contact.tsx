import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Contact: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log('Contact form submitted:', data);
    // Here you would handle form submission
    reset();
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Location',
      details: ['Opolot Close, Ndagire Rd, Wakiso', 'Uganda'],
      color: 'text-emerald-400'
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+256 772 420868', '+256 753 420868'],
      color: 'text-blue-400'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: ['info@mtolivesdachurch.com'],
      color: 'text-purple-400'
    },
    {
      icon: Clock,
      title: 'Service Times',
      details: ['Sabbath: 9:00 AM', 'Worship Vespers: Fri 7:00 PM'],
      color: 'text-amber-400'
    }
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
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We'd love to hear from you! Get in touch with our church family for prayer requests, questions, or to learn more about our community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6 text-center hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 bg-gray-100 dark:bg-slate-700 ${info.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-gray-600 dark:text-gray-300 text-sm">
                      {detail}
                    </p>
                  ))}
                </motion.div>
              );
            })}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className="form-input"
                        placeholder="Your first name"
                      />
                      {errors.firstName && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.firstName.message as string}</p>}
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className="form-input"
                        placeholder="Your last name"
                      />
                      {errors.lastName && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.lastName.message as string}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="form-input"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message as string}</p>}
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="form-input"
                      placeholder="+256 700 123 456"
                    />
                  </div>

                  <div>
                    <label className="form-label">Subject</label>
                    <select
                      {...register('subject', { required: 'Please select a subject' })}
                      className="form-input"
                    >
                      <option value="">Select a subject</option>
                      <option value="prayer-request">Prayer Request</option>
                      <option value="baptism">Baptism Inquiry</option>
                      <option value="membership">Membership Information</option>
                      <option value="pastoral-care">Pastoral Care</option>
                      <option value="general">General Question</option>
                      <option value="technical">Website/Technical Issue</option>
                    </select>
                    {errors.subject && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.subject.message as string}</p>}
                  </div>

                  <div>
                    <label className="form-label">Message</label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows={5}
                      className="form-input resize-none"
                      placeholder="Your message..."
                    ></textarea>
                    {errors.message && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.message.message as string}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Find Us</h3>
                <div className="aspect-video bg-gray-100 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Interactive map would be embedded here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Naalya, Kampala, Uganda</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <a
                    href="tel:+256700123456"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">Call Us</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">+256 700 123 456</div>
                    </div>
                  </a>
                  <a
                    href="mailto:info@mtolivessda.org"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">Email Us</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">info@mtolivessda.org</div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">WhatsApp</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">+256 700 123 456</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Office Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Monday - Thursday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Friday</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sabbath</span>
                    <span className="text-gray-900 dark:text-white">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Sunday</span>
                    <span className="text-gray-900 dark:text-white">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 section-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">Need Pastoral Care?</h2>
            <p className="text-xl mb-8 text-emerald-100">
              For urgent pastoral care, prayer requests, or spiritual guidance, our pastoral team is available 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+256700123456"
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Call Pastor</span>
              </a>
              <a
                href="#"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};