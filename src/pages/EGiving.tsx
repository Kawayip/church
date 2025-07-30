import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Heart, Gift, Users, Receipt, Shield, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const EGiving: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('tithe');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const quickAmounts = ['10000', '25000', '50000', '100000', '250000', '500000'];
  
  const givingPurposes = [
    { id: 'tithe', name: 'Tithe (10%)', description: 'Return to God what belongs to Him', icon: Gift },
    { id: 'offering', name: 'Sabbath Offering', description: 'General church operations and ministries', icon: Heart },
    { id: 'missions', name: 'Mission Offering', description: 'Support global evangelism efforts', icon: Users },
    { id: 'building', name: 'Building Fund', description: 'Church building and maintenance projects', icon: Gift },
    { id: 'youth', name: 'Youth Ministry', description: 'Support youth programs and activities', icon: Users },
    { id: 'community', name: 'Community Outreach', description: 'Help serve our local community', icon: Heart }
  ];

  const onSubmit = (data: any) => {
    console.log('Form submitted:', { ...data, amount: selectedAmount, purpose: selectedPurpose, method: paymentMethod });
    // Here you would integrate with payment processing
  };

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
              E-<span className="text-gradient-accent">Giving</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Support God's work through convenient and secure online giving. Your contributions help us serve our community and spread the Gospel.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <span>Secure & Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <span>Automatic Receipts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                <span>Mobile Money Supported</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Giving Form */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="card p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Make a Donation</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Purpose Selection */}
                  <div>
                    <label className="form-label">Select Purpose</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {givingPurposes.map((purpose) => {
                        const IconComponent = purpose.icon;
                        return (
                          <button
                            key={purpose.id}
                            type="button"
                            onClick={() => setSelectedPurpose(purpose.id)}
                            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
                              selectedPurpose === purpose.id
                                ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/10'
                                : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 hover:border-gray-400 dark:hover:border-slate-500'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <IconComponent className={`h-5 w-5 mt-1 ${
                                selectedPurpose === purpose.id ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                              }`} />
                              <div>
                                <h3 className={`font-medium ${
                                  selectedPurpose === purpose.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'
                                }`}>
                                  {purpose.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{purpose.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Amount Selection */}
                  <div>
                    <label className="form-label">Amount (UGX)</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {quickAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setSelectedAmount(amount)}
                          className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            selectedAmount === amount
                              ? 'btn-primary'
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                          }`}
                        >
                          {parseInt(amount).toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="form-label">Payment Method</label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="mpesa"
                          checked={paymentMethod === 'mpesa'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-emerald-500"
                        />
                        <Smartphone className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">Mobile Money (M-PESA)</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pay using your mobile money account</p>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-emerald-500"
                        />
                        <CreditCard className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        <div>
                          <span className="text-gray-900 dark:text-white font-medium">Credit/Debit Card</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pay with Visa, Mastercard, or other cards</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        {...register('fullName', { required: 'Full name is required' })}
                        className="form-input"
                        placeholder="Your full name"
                      />
                      {errors.fullName && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.fullName.message as string}</p>}
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
                  </div>

                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="form-input"
                      placeholder="+256 700 123 456"
                    />
                    {errors.phone && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone.message as string}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!selectedAmount || parseInt(selectedAmount) < 1000}
                    className="w-full btn-accent px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Gift className="h-5 w-5" />
                    <span>Give UGX {selectedAmount ? parseInt(selectedAmount).toLocaleString() : '0'}</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Bible Verse */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-600/10 border border-emerald-500/20 rounded-xl p-6">
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                  "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
                </blockquote>
                <cite className="text-emerald-600 dark:text-emerald-400 font-medium">2 Corinthians 9:7</cite>
              </div>

              {/* Security Features */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Secure & Transparent</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mt-1" />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium">SSL Encrypted</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Your personal and payment information is protected</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mt-1" />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium">Automatic Receipts</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Receive email and SMS confirmation instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 mt-1" />
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-medium">Annual Statements</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Year-end giving statements for tax purposes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Statistics */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">500+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lives Touched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">25</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Ministries Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">100+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Baptisms This Year</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">50+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Community Projects</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If you have questions about giving or need assistance with your donation, please contact our treasurer.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white">Email:</span> treasurer@mtolivessda.org
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="text-gray-900 dark:text-white">Phone:</span> +256 700 123 456
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};