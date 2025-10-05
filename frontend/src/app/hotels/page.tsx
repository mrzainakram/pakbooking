'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Calendar, Users, Star, Filter, 
  ArrowLeft, Heart, Eye, Wifi, Car, Coffee, Dumbbell, LogOut, Sun, Moon, Globe
} from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { propertiesAPI, favoritesAPI, handleAPIError } from '@/lib/api';
import toast from 'react-hot-toast';

export default function HotelsPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, language, toggleTheme, setLanguage, t } = useTheme();
  
  // Fallback translations for hotels page
  const getTranslation = (key: string) => {
    const fallbacks = {
      'hotels.search.title': {
        en: 'Find Your Perfect Hotel',
        ur: 'اپنا بہترین ہوٹل تلاش کریں',
        roman: 'Apna Behtareen Hotel Talash Karein'
      },
      'hotels.search.destination': {
        en: 'Destination',
        ur: 'منزل',
        roman: 'Manzil'
      },
      'hotels.search.destination.placeholder': {
        en: 'Where to?',
        ur: 'کہاں جانا ہے؟',
        roman: 'Kahan Jana Hai?'
      },
      'hotels.search.checkin': {
        en: 'Check In',
        ur: 'چیک ان',
        roman: 'Check In'
      },
      'hotels.search.checkout': {
        en: 'Check Out',
        ur: 'چیک آؤٹ',
        roman: 'Check Out'
      },
      'hotels.search.guests': {
        en: 'Guests',
        ur: 'مہمان',
        roman: 'Mehmaan'
      },
      'hotels.search.button': {
        en: 'Search Hotels',
        ur: 'ہوٹلز تلاش کریں',
        roman: 'Hotels Talash Karein'
      },
      'hotels.available.title': {
        en: 'Available Hotels',
        ur: 'دستیاب ہوٹلز',
        roman: 'Dastiyab Hotels'
      },
      'hotels.available.filters': {
        en: 'Filters',
        ur: 'فلٹرز',
        roman: 'Filters'
      },
      'hotels.footer.tagline': {
        en: 'Discover and book the best hotels across Pakistan with our premium booking platform.',
        ur: 'ہمارے پریمیم بکنگ پلیٹ فارم کے ساتھ پاکستان بھر کے بہترین ہوٹلز دریافت اور بک کریں۔',
        roman: 'Hamare Premium Booking Platform Ke Saath Pakistan Bhar Ke Behtareen Hotels Daryaft Aur Book Karein.'
      },
      'hotels.footer.copyright': {
        en: '© 2024 PakBooking by Terasols. All rights reserved.',
        ur: '© 2024 پاک بکنگ بذریعہ ٹیراسولز۔ تمام حقوق محفوظ ہیں۔',
        roman: '© 2024 PakBooking By Terasols. Tamam Huqooq Mehfooz Hain.'
      }
    };
    
    return fallbacks[key]?.[language] || fallbacks[key]?.en || t(key);
  };
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        console.log('Fetching hotels from API...');
        console.log('API URL:', 'http://127.0.0.1:8000/api/listings/');
        
        // Direct API call for testing
        const directResponse = await fetch('http://127.0.0.1:8000/api/listings/');
        const directData = await directResponse.json();
        console.log('Direct API Response:', directData);
        
        // Use direct data if API call works
        if (directData && directData.results) {
          setHotels(directData.results);
          console.log('Using direct data, hotels count:', directData.results.length);
        } else {
          const response = await propertiesAPI.getProperties();
          console.log('API Response:', response);
          console.log('Hotels data:', response.results || response);
          setHotels(response.results || response);
        }
      } catch (error) {
        console.error('Failed to fetch hotels:', error);
        console.error('Error details:', error);
        toast.error('Failed to load hotels. Please try again.');
        // Fallback to empty array
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
    
    // Fetch favorites if user is authenticated
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      // Clear favorites if user is not authenticated
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const favoritesData = await favoritesAPI.getFavorites();
      console.log('Favorites data:', favoritesData); // Debug log
      
      // Handle different response formats
      if (Array.isArray(favoritesData)) {
        setFavorites(favoritesData.map((fav: any) => fav.property.id));
      } else if (favoritesData?.results && Array.isArray(favoritesData.results)) {
        setFavorites(favoritesData.results.map((fav: any) => fav.property.id));
      } else {
        console.log('Favorites data is not an array:', favoritesData);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      setFavorites([]);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchParams = {
        city: searchData.destination,
        check_in: searchData.checkIn,
        check_out: searchData.checkOut,
        guests: searchData.guests
      };
      
      const response = await propertiesAPI.getProperties(searchParams);
      setHotels(response.results || response);
      
      if ((response.results || response).length === 0) {
        toast.error('No hotels found for your search criteria');
      } else {
        toast.success(`Found ${(response.results || response).length} hotels`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (hotelId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      const isFav = favorites.includes(hotelId);
      if (isFav) {
        await favoritesAPI.removeFromFavorites(hotelId);
        setFavorites(prev => prev.filter(id => id !== hotelId));
        toast.success('Removed from favorites');
      } else {
        await favoritesAPI.addToFavorites(hotelId);
        setFavorites(prev => [...prev, hotelId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

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
              <Link href="/hotels" className="text-white hover:text-primary-400 transition-colors font-medium text-lg">
                {t('nav.hotels')}
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
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

      {/* Search Section */}
      <section className="px-6" style={{ marginTop: "20px", paddingTop: "30px" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-dark rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{getTranslation('hotels.search.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{getTranslation('hotels.search.destination')}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                    className="input-3d-dark pl-12 w-full"
                    placeholder={getTranslation('hotels.search.destination.placeholder')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{getTranslation('hotels.search.checkin')}</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    className="input-3d-dark pl-12 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{getTranslation('hotels.search.checkout')}</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 w-5 h-5" />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    className="input-3d-dark pl-12 w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{getTranslation('hotels.search.guests')}</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                    className="input-3d-dark pl-12 w-full"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={handleSearch}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-3d w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{getTranslation('hotels.search.button')}</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-black text-white">
              {getTranslation('hotels.available.title')} ({hotels.length})
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 glass-dark px-4 py-2 rounded-xl text-white"
            >
              <Filter className="w-5 h-5" />
              <span>{getTranslation('hotels.available.filters')}</span>
            </motion.button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="text-white ml-4">Loading hotels...</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-2xl font-bold text-white mb-2">No hotels found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
              <p className="text-gray-500 text-sm mt-2">Debug: Hotels array length: {hotels.length}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel, index) => (
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
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(hotel.id)}
                      className={`glass-dark rounded-full p-2 hover:bg-white/20 transition-colors ${
                        favorites.includes(hotel.id) ? 'bg-red-500/20' : ''
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          favorites.includes(hotel.id) 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-white'
                        }`} 
                      />
                    </motion.button>
                  </div>
                  <SafeImage
                    src={hotel.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
                    alt={hotel.title}
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
                    {hotel.title}
                  </h3>
                  <p className="text-gray-400 mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {hotel.city}
                  </p>
                  
                  <p className="text-gray-300 text-sm mb-4">{hotel.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities && hotel.amenities.slice(0, 4).map((amenity) => (
                      <span key={amenity} className="text-xs bg-dark-800 text-gray-300 px-2 py-1 rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-white">₨{parseFloat(hotel.price_per_night).toLocaleString()}</span>
                      </div>
                      <span className="text-gray-400 text-sm">per night • Max {hotel.max_guests} guests</span>
                    </div>
                    <Link href={`/hotels/${hotel.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-3d px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-sm flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Book Now</span>
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          )}
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
            {getTranslation('hotels.footer.tagline')}
          </p>
          
          <div className="border-t border-white/10 pt-8">
            <p className="text-gray-500">
              {getTranslation('hotels.footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 