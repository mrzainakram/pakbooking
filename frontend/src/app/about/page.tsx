'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Award, Users, MapPin, Phone, Mail, 
  Shield, Zap, Heart, Star, ArrowLeft, CheckCircle, MessageCircle, 
  Github, Linkedin, Sun, Moon, Globe, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function AboutPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, language, toggleTheme, setLanguage, t } = useTheme();
  
  const stats = [
    { number: '5+', label: t('about.stats.experience'), icon: <Award className="w-6 h-6" /> },
    { number: '1000+', label: t('about.stats.clients'), icon: <Users className="w-6 h-6" /> },
    { number: '50+', label: t('about.stats.projects'), icon: <CheckCircle className="w-6 h-6" /> },
    { number: '24/7', label: t('about.stats.support'), icon: <Shield className="w-6 h-6" /> }
  ];

  const services = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t('about.services.booking.title'),
      description: t('about.services.booking.desc')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('about.services.confirmation.title'),
      description: t('about.services.confirmation.desc')
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('about.services.payments.title'),
      description: t('about.services.payments.desc')
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
              <Link href="/about" className="text-white hover:text-primary-400 transition-colors font-medium text-lg">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
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
              {t('about.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center card-dark p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 text-3d">
                {t('about.story.title')}
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                {t('about.story.desc1')}
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                {t('about.story.desc2')}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <a 
                  href="tel:+923046164257" 
                  className="flex items-center space-x-4 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-6 h-6 text-white" />
                  <span className="text-white text-lg">+92 304 6164257</span>
                </a>
                <a 
                  href="mailto:mrzainakram01@gmail.com" 
                  className="flex items-center space-x-4 hover:text-secondary-400 transition-colors"
                >
                  <Mail className="w-6 h-6 text-white" />
                  <span className="text-white text-lg">mrzainakram01@gmail.com</span>
                </a>
                <a 
                  href="https://wa.me/923046164257?text=Hi! I'm interested in PakBooking services." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 hover:text-green-400 transition-colors"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                  <span className="text-white text-lg">WhatsApp</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/muhammad-zain-akram-" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 hover:text-blue-400 transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                  <span className="text-white text-lg">LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/mrzainakram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 hover:text-purple-400 transition-colors"
                >
                  <Github className="w-6 h-6 text-white" />
                  <span className="text-white text-lg">GitHub</span>
                </a>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-white" />
                  <span className="text-white text-lg">Pakistan</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card-dark p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">{t('about.mission.title')}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('about.mission.desc')}
              </p>
              
              <h3 className="text-2xl font-bold text-white mb-6">{t('about.vision.title')}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t('about.vision.desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 text-3d">
              {t('about.services.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('about.services.subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-dark p-8 text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
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
            Pakistan's premier hotel booking platform. Discover amazing accommodations 
            and create unforgettable travel experiences across the country.
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