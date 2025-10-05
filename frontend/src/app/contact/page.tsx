'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Clock, Send, ArrowLeft,
  MessageCircle, Globe, Users, Github, Linkedin, Sun, Moon, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ContactPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, language, toggleTheme, setLanguage, t } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert(t('contact.form.success'));
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: t('contact.info.phone'),
      details: '+92 304 6164257',
      description: t('contact.info.phone.desc'),
      link: 'tel:+923046164257'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: t('contact.info.email'),
      details: 'mrzainakram01@gmail.com',
      description: t('contact.info.email.desc'),
      link: 'mailto:mrzainakram01@gmail.com'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: t('contact.info.whatsapp'),
      details: t('contact.info.whatsapp.desc'),
      description: t('contact.info.whatsapp.text'),
      link: 'https://wa.me/923046164257?text=Hi! I need help with PakBooking.'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('contact.info.hours'),
      details: t('contact.info.hours.value'),
      description: t('contact.info.hours.desc')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-dark-900/95 to-dark-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="w-full px-6 py-6 flex items-center justify-between">
          {/* Left Side - Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">P</span>
              </div>
              <span className="text-2xl font-display font-black text-gradient">
                PakBooking
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                {t('nav.home')}
              </Link>
              <Link href="/hotels" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                {t('nav.hotels')}
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-white hover:text-primary-400 transition-colors font-medium text-lg">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Dashboard Button */}
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-3d px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium text-base h-12"
                  >
                    {t('nav.dashboard')}
                  </motion.button>
                </Link>
                
                {/* Admin Button */}
                {user?.is_staff && (
                  <Link href="/admin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-3d px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium text-base h-12"
                    >
                      {t('nav.admin')}
                    </motion.button>
                  </Link>
                )}
                
                {/* Active User Info */}
                <div className="flex items-center h-12">
                  <span className="text-white font-medium text-base whitespace-nowrap">
                    Active User: {user?.first_name || ''} {user?.last_name || ''}
                  </span>
                </div>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const languages = ['en', 'ur', 'roman'] as const;
                      const currentIndex = languages.indexOf(language);
                      const nextIndex = (currentIndex + 1) % languages.length;
                      setLanguage(languages[nextIndex]);
                    }}
                    className="flex items-center justify-between bg-dark-800/80 border border-white/20 rounded-lg pl-4 pr-4 py-3 text-white text-base hover:bg-dark-700/80 focus:outline-none focus:border-primary-400 cursor-pointer h-12 min-w-[120px] font-medium transition-colors"
                  >
                    <span>
                      {language === 'en' && 'English'}
                      {language === 'ur' && 'اردو'}
                      {language === 'roman' && 'Roman'}
                    </span>
                    <Globe className="w-5 h-5 text-white ml-2" />
                  </button>
                </div>

                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-12 h-12 bg-dark-800/80 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white transition-colors px-4 py-3 rounded-lg hover:bg-white/10 h-12 font-medium text-base"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('nav.logout')}</span>
                </button>
                </>
            ) : (
              <>
                <Link href="/auth" className="text-gray-300 hover:text-white transition-colors font-medium text-xl px-6 py-3 rounded-lg border border-gray-600 hover:border-white">
                  {t('nav.signin')}
                </Link>
                <Link href="/auth">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-3d px-10 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-xl shadow-2xl"
                  >
                    {t('nav.getstarted')}
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for navbar */}
      <div className="navbar-spacer"></div>

      {/* Hero Section */}
      <section className="px-6" style={{ marginTop: "20px", paddingTop: "30px" }}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 text-3d">
              {t('contact.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 px-6 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const CardComponent = info.link ? 'a' : 'div';
              const cardProps = info.link ? {
                href: info.link,
                target: info.link.startsWith('http') ? '_blank' : undefined,
                rel: info.link.startsWith('http') ? 'noopener noreferrer' : undefined
              } : {};
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="card-dark p-6 text-center group"
                >
                  <CardComponent {...cardProps} className={info.link ? "block hover:text-primary-400 transition-colors" : ""}>
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                    <p className="text-primary-400 font-semibold mb-2">{info.details}</p>
                    <p className="text-gray-400 text-sm">{info.description}</p>
                  </CardComponent>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display font-black text-white mb-6 text-3d">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-300 mb-8">
                {t('contact.form.subtitle')}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-3d-dark w-full"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-3d-dark w-full"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-3d-dark w-full"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="input-3d-dark w-full"
                      placeholder="Project inquiry"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="input-3d-dark w-full h-32 resize-none"
                    placeholder="Tell us about your project..."
                    required
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-3d w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{t('contact.form.send')}</span>
                </motion.button>
              </form>
            </motion.div>
            
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="card-dark p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Why Choose PakBooking?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Users className="w-6 h-6 text-primary-500 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Expert Team</h4>
                      <p className="text-gray-400 text-sm">Experienced developers and designers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Globe className="w-6 h-6 text-secondary-500 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">Global Standards</h4>
                      <p className="text-gray-400 text-sm">International quality and best practices</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MessageCircle className="w-6 h-6 text-accent-500 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">24/7 Support</h4>
                      <p className="text-gray-400 text-sm">Always available for your needs</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-dark p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <a 
                    href="tel:+923046164257" 
                    className="flex items-center space-x-4 hover:text-primary-400 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-white" />
                    <span className="text-white">+92 304 6164257</span>
                  </a>
                  <a 
                    href="mailto:mrzainakram01@gmail.com" 
                    className="flex items-center space-x-4 hover:text-secondary-400 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-white" />
                    <span className="text-white">mrzainakram01@gmail.com</span>
                  </a>
                  <a 
                    href="https://wa.me/923046164257?text=Hi! I need help with hotel booking on PakBooking." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 hover:text-green-400 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span className="text-white">WhatsApp Support</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/muhammad-zain-akram-" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 hover:text-blue-400 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                    <span className="text-white">LinkedIn Profile</span>
                  </a>
                  <a 
                    href="https://github.com/mrzainakram" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 hover:text-purple-400 transition-colors"
                  >
                    <Github className="w-5 h-5 text-white" />
                    <span className="text-white">GitHub Profile</span>
                  </a>
                  <div className="flex items-center space-x-4">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white">Available 24/7</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-3xl font-display font-black text-gradient">
              PakBooking
            </span>
          </div>
          
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Ready to book your next hotel stay? Contact us today for personalized assistance and travel recommendations.
          </p>
          
          <div className="border-t border-white/10 pt-8">
            <p className="text-gray-500">
              © 2024 PakBooking. All rights reserved. Built with ❤️ in Pakistan.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 