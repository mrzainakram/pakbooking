'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Calendar, Users, Star, Filter, 
  ArrowRight, Play, Shield, Zap, Award, Heart,
  ChevronLeft, ChevronRight, Eye, Wifi, Car, 
  Coffee, Dumbbell, Waves, Mountain, LogOut, Sun, Moon, Globe
} from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, language, toggleTheme, setLanguage, t } = useTheme();
  
  console.log('Current language:', language);
  console.log('Translation for nav.home:', t('nav.home'));
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample hotel data (will be replaced with API data)
  const featuredHotels = [
    {
      id: 1,
      name: 'Pearl Continental Lahore',
      location: 'Lahore, Punjab',
      rating: 4.8,
      reviews: 1240,
      price: 15000,
      originalPrice: 18000,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
      description: 'Luxury hotel in the heart of Lahore with world-class amenities',
      discount: 17,
      featured: true
    },
    {
      id: 2,
      name: 'Serena Hotel Islamabad',
      location: 'Islamabad, Capital',
      rating: 4.9,
      reviews: 890,
      price: 18000,
      originalPrice: 22000,
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      amenities: ['WiFi', 'Business Center', 'Restaurant', 'Parking'],
      description: 'Premium business hotel with stunning city views',
      discount: 18,
      featured: true
    },
    {
      id: 3,
      name: 'Movenpick Hotel Karachi',
      location: 'Karachi, Sindh',
      rating: 4.7,
      reviews: 756,
      price: 12000,
      originalPrice: 15000,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      amenities: ['WiFi', 'Pool', 'Parking', 'Room Service'],
      description: 'Modern hotel near the business district',
      discount: 20,
      featured: true
    },
    {
      id: 4,
      name: 'Hunza Serena Inn',
      location: 'Hunza Valley, GB',
      rating: 5.0,
      reviews: 445,
      price: 25000,
      originalPrice: 30000,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      amenities: ['WiFi', 'Mountain View', 'Restaurant', 'Garden'],
      description: 'Breathtaking mountain resort in Hunza Valley',
      discount: 17,
      featured: true
    },
    {
      id: 5,
      name: 'Marriott Hotel Karachi',
      location: 'Karachi, Sindh',
      rating: 4.6,
      reviews: 1100,
      price: 16000,
      originalPrice: 20000,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      amenities: ['WiFi', 'Spa', 'Pool', 'Business Center'],
      description: 'International luxury with Pakistani hospitality',
      discount: 20,
      featured: false
    },
    {
      id: 6,
      name: 'Avari Hotel Lahore',
      location: 'Lahore, Punjab',
      rating: 4.5,
      reviews: 890,
      price: 13000,
      originalPrice: 16000,
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
      amenities: ['WiFi', 'Restaurant', 'Parking', 'Conference'],
      description: 'Historic elegance meets modern comfort',
      discount: 19,
      featured: false
    }
  ];

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&h=1080&fit=crop',
      title: t('home.hero.title'),
      subtitle: t('home.hero.subtitle'),
    },
    {
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&h=1080&fit=crop',
      title: t('home.slides.confidence.title'),
      subtitle: t('home.slides.confidence.subtitle'),
    },
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop',
      title: t('home.slides.unforgettable.title'),
      subtitle: t('home.slides.unforgettable.subtitle'),
    }
  ];

  const stats = [
    { number: '1000+', label: t('home.stats.hotels'), icon: <Award className="w-6 h-6" /> },
    { number: '50K+', label: t('home.stats.guests'), icon: <Users className="w-6 h-6" /> },
    { number: '25+', label: t('home.stats.cities'), icon: <MapPin className="w-6 h-6" /> },
    { number: '99%', label: t('home.stats.satisfaction'), icon: <Star className="w-6 h-6" /> }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('home.why.secure.title'),
      description: t('home.why.secure.desc')
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('home.why.instant.title'),
      description: t('home.why.instant.desc')
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('home.why.prices.title'),
      description: t('home.why.prices.desc')
    }
  ];

  const handleSearch = () => {
    // Redirect to hotels page with search parameters
    const params = new URLSearchParams({
      destination: searchData.destination,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guests: searchData.guests.toString()
    });
    window.location.href = `/hotels?${params.toString()}`;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation - Updated with better alignment */}
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
              <Link href="/" className="text-white hover:text-primary-400 transition-colors font-medium text-lg">
                Home
              </Link>
              <Link href="/hotels" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                Hotels
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                About
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                Contact
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
                    Dashboard
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
                      Admin
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
                      console.log('Language changing from', language, 'to', languages[nextIndex]);
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
                  <span>Logout</span>
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

        {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
        <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <SafeImage
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
          </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-display font-black text-white mb-6 text-3d"
            >
              {heroSlides[currentSlide].title}
            </motion.h1>
          <motion.p
              key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-200 mb-12 font-medium"
            >
              {heroSlides[currentSlide].subtitle}
          </motion.p>

          {/* 3D Interactive Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-6xl mx-auto py-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 - Luxury Hotels */}
              <motion.div 
                className="glass overflow-hidden rounded-2xl border border-white/20 relative group"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 20,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)"
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-600/30 opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                <div className="absolute inset-0 backdrop-blur-sm z-10"></div>
                <div 
                  className="absolute inset-0 bg-mesh opacity-20 z-0"
                  style={{ backgroundSize: "30px 30px" }}
                ></div>
                
                <div className="p-8 relative z-20 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-6 shadow-glow">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white mb-3 text-3d">{t('home.cards.luxury.title')}</h3>
                  <p className="text-gray-200 mb-6">{t('home.cards.luxury.desc')}</p>
                  <Link href="/hotels" className="mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-3d px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-bold"
                    >
                      {t('home.cta.explore')}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Card 2 - Family Getaways */}
              <motion.div 
                className="glass overflow-hidden rounded-2xl border border-white/20 relative group"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  z: 20,
                  boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.5)"
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/30 to-accent-600/30 opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                <div className="absolute inset-0 backdrop-blur-sm z-10"></div>
                <div 
                  className="absolute inset-0 bg-mesh opacity-20 z-0"
                  style={{ backgroundSize: "30px 30px" }}
                ></div>
                
                <div className="p-8 relative z-20 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center mb-6 shadow-glow">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white mb-3 text-3d">{t('home.cards.family.title')}</h3>
                  <p className="text-gray-200 mb-6">{t('home.cards.family.desc')}</p>
                  <Link href="/hotels" className="mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-3d px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-bold"
                    >
                      {t('home.cta.explore')}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              {/* Card 3 - Adventure Stays */}
              <motion.div 
                className="glass overflow-hidden rounded-2xl border border-white/20 relative group"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 20,
                  boxShadow: "0 25px 50px -12px rgba(245, 158, 11, 0.5)"
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/30 to-primary-600/30 opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                <div className="absolute inset-0 backdrop-blur-sm z-10"></div>
                <div 
                  className="absolute inset-0 bg-mesh opacity-20 z-0"
                  style={{ backgroundSize: "30px 30px" }}
                ></div>
                
                <div className="p-8 relative z-20 flex flex-col items-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mb-6 shadow-glow">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-white mb-3 text-3d">{t('home.cards.adventure.title')}</h3>
                  <p className="text-gray-200 mb-6">{t('home.cards.adventure.desc')}</p>
                  <Link href="/hotels" className="mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-3d px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-bold"
                    >
                      {t('home.cta.explore')}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
              </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link href="/hotels">
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-3d px-10 py-5 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-2xl font-bold text-xl shadow-2xl"
                >
                  {t('home.cta.search')}
              </motion.button>
              </Link>
            </div>
          </motion.div>
          </motion.div>
        </div>
        
        {/* Slide Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 glass-dark rounded-full p-3 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 glass-dark rounded-full p-3 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
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

      {/* Featured Hotels */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
                  <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 text-3d">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('home.featured.subtitle')}
            </p>
                  </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.slice(0, 6).map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-dark rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {hotel.discount && (
                    <div className="absolute top-4 left-4 z-10 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {hotel.discount}% OFF
                    </div>
                  )}
                  <div className="absolute top-4 right-4 z-10">
                    <button className="glass-dark rounded-full p-2 hover:bg-white/20 transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <SafeImage
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-accent-400 fill-current" />
                      <span className="text-white font-bold">{hotel.rating}</span>
                      <span className="text-gray-300 text-sm">({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-400 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {hotel.location}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity} className="text-xs bg-dark-800 text-gray-300 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-white">₨{hotel.price.toLocaleString()}</span>
                        {hotel.originalPrice > hotel.price && (
                          <span className="text-sm text-gray-500 line-through">₨{hotel.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <span className="text-gray-400 text-sm">per night</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-3d px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-sm flex items-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/hotels">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-3d px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg flex items-center space-x-2 mx-auto"
              >
                <span>{t('home.featured.viewall')}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 text-3d">
              {t('home.why.title')}
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('home.why.subtitle')}
            </p>
        </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">P</span>
              </div>
              <span className="text-3xl font-display font-black text-gradient">
                PakBooking
              </span>
            </Link>
            
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              {t('home.footer.tagline')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">{t('home.footer.links.about')}</Link>
              <Link href="/hotels" className="text-gray-400 hover:text-white transition-colors">{t('home.footer.links.hotels')}</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{t('home.footer.links.contact')}</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">{t('home.footer.links.privacy')}</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">{t('home.footer.links.terms')}</Link>
            </div>
            
            <div className="border-t border-white/10 pt-8">
              <p className="text-gray-500">
                {t('home.footer.copyright')}
              </p>
            </div>
          </div>
      </div>
      </footer>
    </div>
  );
}
