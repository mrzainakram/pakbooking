'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Calendar, CreditCard, TrendingUp, 
  AlertCircle, CheckCircle, XCircle, Clock, RefreshCw,
  Eye, Edit, Trash2, Filter, Search, Download, Mail,
  MessageCircle, Phone, Settings, Shield, DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { adminAPI, handleAPIError } from '@/lib/api';
import SafeImage from '@/components/ui/SafeImage';
import toast from 'react-hot-toast';

interface DashboardStats {
  total_bookings: number;
  total_revenue: number;
  active_users: number;
  total_properties: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  monthly_revenue: number;
  monthly_bookings: number;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user is admin (you should implement proper role checking)
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    
    // Check if user has admin privileges
    // This should be implemented based on your backend user roles
    if (!user?.email?.includes('admin') && user?.email !== 'mrzainakram01@gmail.com') {
      toast.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsData = await adminAPI.getDashboardStats();
        setStats(statsData);

        // Fetch bookings
        const bookingsData = await adminAPI.getBookings();
        setBookings(bookingsData.results || bookingsData);

        // Fetch users
        const usersData = await adminAPI.getUsers();
        setUsers(usersData.results || usersData);

        // Fetch properties
        const propertiesData = await adminAPI.getProperties();
        setProperties(propertiesData.results || propertiesData);

        // Fetch payments
        const paymentsData = await adminAPI.getPayments();
        setPayments(paymentsData.results || paymentsData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.email?.includes('admin') || user?.email === 'mrzainakram01@gmail.com') {
      fetchAdminData();
    }
  }, [isAuthenticated, user]);

  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await adminAPI.updateBooking(bookingId, { status });
      toast.success(`Booking ${status} successfully`);
      
      // Refresh bookings
      const bookingsData = await adminAPI.getBookings();
      setBookings(bookingsData.results || bookingsData);
    } catch (error) {
      toast.error(handleAPIError(error));
    }
  };

  const handleProcessRefund = async (transactionId: string, amount?: number) => {
    if (!confirm(`Are you sure you want to process refund for transaction ${transactionId}?`)) {
      return;
    }

    try {
      await adminAPI.processRefund(transactionId, amount);
      toast.success('Refund processed successfully');
      
      // Refresh payments
      const paymentsData = await adminAPI.getPayments();
      setPayments(paymentsData.results || paymentsData);
    } catch (error) {
      toast.error(handleAPIError(error));
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
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesSearch = booking.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isAuthenticated || (!user?.email?.includes('admin') && user?.email !== 'mrzainakram01@gmail.com')) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-dark-900/95 to-dark-800/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-display font-black text-gradient">
              PakBooking Admin
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-white font-medium">Admin Panel</div>
                <div className="text-gray-400 text-sm">{user?.email}</div>
              </div>
            </div>
            
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for navbar */}
      <div className="navbar-spacer"></div>

      {/* Admin Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-display font-black text-white mb-4">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-400">
                Manage bookings, users, and system settings
              </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
                { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
                { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
                { id: 'properties', label: 'Properties', icon: <Settings className="w-5 h-5" /> },
                { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card-dark p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Total Bookings</p>
                              <p className="text-2xl font-bold text-white">{stats?.total_bookings || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-400" />
                            </div>
                          </div>
                        </div>

                        <div className="card-dark p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Total Revenue</p>
                              <p className="text-2xl font-bold text-white">₨{stats?.total_revenue?.toLocaleString() || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-6 h-6 text-green-400" />
                            </div>
                          </div>
                        </div>

                        <div className="card-dark p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Active Users</p>
                              <p className="text-2xl font-bold text-white">{stats?.active_users || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-400" />
                            </div>
                          </div>
                        </div>

                        <div className="card-dark p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-400 text-sm">Total Properties</p>
                              <p className="text-2xl font-bold text-white">{stats?.total_properties || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                              <Settings className="w-6 h-6 text-orange-400" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card-dark p-6">
                          <h3 className="text-xl font-bold text-white mb-4">Booking Status Overview</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-gray-300">Pending</span>
                              </div>
                              <span className="text-white font-bold">{stats?.pending_bookings || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                <span className="text-gray-300">Confirmed</span>
                              </div>
                              <span className="text-white font-bold">{stats?.confirmed_bookings || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <span className="text-gray-300">Cancelled</span>
                              </div>
                              <span className="text-white font-bold">{stats?.cancelled_bookings || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="card-dark p-6">
                          <h3 className="text-xl font-bold text-white mb-4">Monthly Performance</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">This Month's Revenue</span>
                              <span className="text-green-400 font-bold">₨{stats?.monthly_revenue?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">This Month's Bookings</span>
                              <span className="text-blue-400 font-bold">{stats?.monthly_bookings || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Average Booking Value</span>
                              <span className="text-purple-400 font-bold">
                                ₨{stats?.monthly_bookings ? Math.round((stats?.monthly_revenue || 0) / stats.monthly_bookings).toLocaleString() : 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'bookings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Bookings Controls */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center space-x-4">
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

                      <div className="relative">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="input-3d-dark pl-12 pr-8"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <button className="btn-3d px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  {/* Bookings Table */}
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <div className="card-dark overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-dark-800">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Booking
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Guest
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Property
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Dates
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {filteredBookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-white/5">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white font-medium">#{booking.id}</div>
                                  <div className="text-sm text-gray-400">
                                    {new Date(booking.created_at).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{booking.user?.first_name} {booking.user?.last_name}</div>
                                  <div className="text-sm text-gray-400">{booking.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">{booking.property?.title}</div>
                                  <div className="text-sm text-gray-400">{booking.property?.city}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white">
                                    {new Date(booking.check_in).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    to {new Date(booking.check_out).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-white font-medium">
                                    ₨{booking.total_price?.toLocaleString()}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                    {getStatusIcon(booking.status)}
                                    <span className="capitalize">{booking.status}</span>
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                      disabled={booking.status === 'confirmed'}
                                      className="text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                      disabled={booking.status === 'cancelled'}
                                      className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                    <a
                                      href={`mailto:${booking.user?.email}`}
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      <Mail className="w-4 h-4" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                  <p className="text-gray-400">User management features coming soon</p>
                </motion.div>
              )}

              {activeTab === 'properties' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-10 h-10 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Property Management</h3>
                  <p className="text-gray-400">Property management features coming soon</p>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Payment Management</h3>
                  <p className="text-gray-400">Payment management features coming soon</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

