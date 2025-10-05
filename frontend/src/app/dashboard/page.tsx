'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Users, CreditCard, Clock, CheckCircle,
  AlertCircle, XCircle, RefreshCw, Eye, Download, MessageCircle,
  Phone, Mail, Star, Heart, Settings, LogOut, Bell, Filter,
  Search, Grid, List, Plus, ArrowLeft, Sun, Moon, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import { bookingsAPI, notificationsAPI, handleAPIError } from '@/lib/api';
import SafeImage from '@/components/ui/SafeImage';
import toast from 'react-hot-toast';

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, language, toggleTheme, setLanguage, t } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [bookings, setBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  const tabs: TabProps[] = [
    { id: 'bookings', label: 'My Bookings', icon: <Calendar className="w-5 h-5" />, count: bookings.length },
    { id: 'favorites', label: 'Favorites', icon: <Heart className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, count: unreadCount },
    { id: 'profile', label: 'Profile', icon: <Settings className="w-5 h-5" /> }
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings
        try {
          const bookingsData = await bookingsAPI.getBookings();
          console.log('Bookings data:', bookingsData);
          setBookings(bookingsData.results || bookingsData || []);
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
          toast.error('Failed to load bookings. Please try again.');
          setBookings([]);
        }

        // Fetch notifications (gracefully handle missing API)
        try {
          const notificationsData = await notificationsAPI.getNotifications();
          setNotifications(notificationsData.results || notificationsData);
          
          const count = await notificationsAPI.getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Notifications API not available, using mock data');
          // Mock notifications for now
          setNotifications([
            {
              id: 1,
              title: 'Welcome to PakBooking!',
              message: 'Thank you for joining us. Start exploring amazing hotels across Pakistan.',
              type: 'system',
              is_read: false,
              created_at: new Date().toISOString()
            }
          ]);
          setUnreadCount(1);
        }
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Some features may not be available. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking? A cancellation fee of ₨500 will be charged.')) {
      return;
    }

    try {
      await bookingsAPI.cancelBooking(bookingId, 'User requested cancellation');
      toast.success('Booking cancelled successfully');
      
      // Refresh bookings
      const bookingsData = await bookingsAPI.getBookings();
      setBookings(bookingsData.results || bookingsData);
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleMarkNotificationRead = async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'completed': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'refunded': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'refunded': return <RefreshCw className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = bookingFilter === 'all' || booking.status === bookingFilter;
    const matchesSearch = !searchQuery || 
                         (booking.property_details?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.property_details?.city?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (!isAuthenticated) {
    return null;
  }

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
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-medium text-lg">
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </nav>

      {/* Spacer for navbar */}
      <div className="navbar-spacer"></div>

      {/* Dashboard Content */}
      <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 glass-dark px-6 py-3 rounded-xl text-white hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Home</span>
                  </motion.button>
                </Link>
              </div>
              <h1 className="text-4xl font-display font-black text-white mb-4">
                Welcome back, {user?.first_name}!
              </h1>
              <p className="text-xl text-gray-400">
                Manage your bookings and account settings
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {tabs.map((tab) => (
              <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                      : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
              </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'bookings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Bookings Controls */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center space-x-4">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="input-3d-dark pl-12 w-64"
                          placeholder="Search bookings..."
                        />
                      </div>

                      {/* Filter */}
                      <div className="relative">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <select
                          value={bookingFilter}
                          onChange={(e) => setBookingFilter(e.target.value)}
                          className="input-3d-dark pl-12 pr-8"
                        >
                          <option value="all">All Bookings</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                </div>
              </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-dark-800 text-gray-400'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-dark-800 text-gray-400'
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
            </div>
          </div>

                  {/* Bookings List/Grid */}
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="spinner"></div>
                </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-10 h-10 text-gray-500" />
              </div>
                      <h3 className="text-xl font-bold text-white mb-2">No bookings found</h3>
                      <p className="text-gray-400 mb-6">
                        {searchQuery ? 'Try adjusting your search criteria' : 'Start exploring and book your first hotel!'}
                      </p>
                      <Link href="/hotels">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-3d px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold flex items-center space-x-2 mx-auto"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Book a Hotel</span>
                        </motion.button>
                      </Link>
              </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                      {filteredBookings.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className={`card-dark p-6 ${viewMode === 'list' ? 'flex items-center space-x-6' : ''}`}
                        >
                          {/* Hotel Image */}
                          <div className={`relative overflow-hidden rounded-lg ${
                            viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-[4/3] mb-4'
                          }`}>
                            <SafeImage
                              src={booking.property_details?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'}
                              alt={booking.property_details?.title || 'Hotel'}
                              fill
                              className="object-cover"
                            />
                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full border text-xs font-bold flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status}</span>
            </div>
          </div>

                          {/* Booking Details */}
                          <div className={viewMode === 'list' ? 'flex-1' : ''}>
                            <h3 className="text-lg font-bold text-white mb-2">
                              {booking.property_details?.title || 'Hotel Booking'}
                            </h3>
                            
                            <div className="space-y-2 text-sm text-gray-400">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{booking.property_details?.city || 'Pakistan'}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                  </span>
                </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>{booking.guests} Guest{booking.guests > 1 ? 's' : ''}</span>
              </div>
                              <div className="flex items-center space-x-2">
                                <CreditCard className="w-4 h-4" />
                                <span>₨{booking.total_price.toLocaleString()}</span>
            </div>
          </div>

                            {/* Actions */}
                            <div className={`flex items-center space-x-2 ${viewMode === 'list' ? 'mt-4' : 'mt-6'}`}>
                              <Link href={`/booking-details/${booking.id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="btn-3d px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-bold text-sm flex items-center space-x-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View</span>
                                </motion.button>
                              </Link>

                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="btn-3d px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm flex items-center space-x-1"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>Cancel</span>
                                </button>
                              )}

                              <a
                                href={`https://wa.me/923046164257?text=Hi, I need help with booking #${booking.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-3d px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm flex items-center space-x-1"
                              >
                                <MessageCircle className="w-4 h-4" />
                                <span>Support</span>
                              </a>
            </div>
          </div>
        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'favorites' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Favorites Coming Soon</h3>
                  <p className="text-gray-400">Save your favorite hotels for quick booking</p>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                    <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="w-10 h-10 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">No notifications</h3>
                      <p className="text-gray-400">You're all caught up!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          onClick={() => !notification.is_read && handleMarkNotificationRead(notification.id)}
                          className={`card-dark p-4 cursor-pointer transition-all ${
                            !notification.is_read ? 'border-l-4 border-primary-500 bg-primary-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              notification.type === 'booking' ? 'bg-blue-500/20 text-blue-400' :
                              notification.type === 'payment' ? 'bg-green-500/20 text-green-400' :
                              notification.type === 'refund' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {notification.type === 'booking' ? <Calendar className="w-5 h-5" /> :
                               notification.type === 'payment' ? <CreditCard className="w-5 h-5" /> :
                               notification.type === 'refund' ? <RefreshCw className="w-5 h-5" /> :
                               <Bell className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white mb-1">{notification.title}</h4>
                              <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                              <div className="text-xs text-gray-500">
                                {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                )}
              </div>
                        </motion.div>
                      ))}
            </div>
                  )}
          </motion.div>
              )}

              {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="card-dark p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Profile Settings</h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">
                            {user?.first_name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">
                            {user?.first_name} {user?.last_name}
                          </h4>
                          <p className="text-gray-400">{user?.email}</p>
                          <p className="text-sm text-gray-500">
                            Member since {new Date(user?.date_joined || '').toLocaleDateString()}
                          </p>
              </div>
            </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={user?.first_name || ''}
                            className="input-3d-dark w-full"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={user?.last_name || ''}
                            className="input-3d-dark w-full"
                            readOnly
                          />
                        </div>
                  </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="input-3d-dark w-full"
                          readOnly
                        />
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <h4 className="text-lg font-bold text-white mb-4">Contact Support</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <a
                            href="tel:+923046164257"
                            className="flex items-center justify-center space-x-2 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <Phone className="w-5 h-5" />
                            <span>Call Us</span>
                          </a>
                          <a
                            href="mailto:mrzainakram01@gmail.com"
                            className="flex items-center justify-center space-x-2 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors"
                          >
                            <Mail className="w-5 h-5" />
                            <span>Email Us</span>
                          </a>
                          <a
                            href="https://wa.me/923046164257"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

