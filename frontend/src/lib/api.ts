import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },
  
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  },
  
  removeTokens: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          tokenManager.setToken(access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          tokenManager.removeTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      } else {
        // No refresh token, redirect to login
        tokenManager.removeTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: PropertyImage[];
  rating: number;
  reviews_count: number;
  is_available: boolean;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
}

export interface Booking {
  id: number;
  property: Property;
  user: User;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_status: 'unpaid' | 'processing' | 'paid' | 'refunded' | 'failed';
  payment_id?: string;
  refund_amount?: number;
  refund_status?: 'pending' | 'processed' | 'failed';
  cancellation_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  property: number;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

// Notification Types
export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: 'booking_confirmed' | 'booking_cancelled' | 'booking_pending' | 'booking_completed' | 'booking_refunded' | 'payment_received' | 'payment_failed' | 'cancellation_request';
  is_read: boolean;
  booking_details?: Booking;
  time_ago: string;
  created_at: string;
}

export interface BookingStatusHistory {
  id: number;
  old_status: string;
  new_status: string;
  changed_by_name: string;
  reason: string;
  refund_amount?: number;
  deduction_amount?: number;
  created_at: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'jazz_cash' | 'easy_paisa';
  title: string;
  description: string;
  icon: string;
  processing_fee: number;
  is_active: boolean;
}

export interface PaymentTransaction {
  id: string;
  booking: number;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  transaction_date: string;
  processing_fee: number;
  refund_amount?: number;
  refund_date?: string;
  refund_reason?: string;
}

// API Endpoints
export const authAPI = {
  // Register user
  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login/', credentials);
    const { access, refresh, user } = response.data;
    
    tokenManager.setToken(access);
    tokenManager.setRefreshToken(refresh);
    
    return { access, refresh, user };
  },
  
  // Logout user
  logout: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    tokenManager.removeTokens();
  },
  
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/user/');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.patch('/auth/user/', userData);
    return response.data;
  },
  
  // Change password
  changePassword: async (passwords: {
    old_password: string;
    new_password: string;
  }) => {
    const response = await api.post('/auth/change-password/', passwords);
    return response.data;
  },
};

export const propertiesAPI = {
  // Get all properties with filters
  getProperties: async (params?: {
    city?: string;
    check_in?: string;
    check_out?: string;
    guests?: number;
    min_price?: number;
    max_price?: number;
    amenities?: string[];
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/listings/', { params });
    return response.data;
  },
  
  // Get single property
  getProperty: async (id: string): Promise<Property> => {
    const response = await api.get(`/listings/${id}/`);
    return response.data;
  },
  
  // Search properties
  searchProperties: async (query: string) => {
    const response = await api.get(`/properties/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  },
  
  // Get property availability
  getAvailability: async (propertyId: string, checkIn: string, checkOut: string) => {
    const response = await api.get(`/bookings/availability/`, {
      params: {
        property: propertyId,
        check_in: checkIn,
        check_out: checkOut,
      },
    });
    return response.data;
  },
  
  // Get featured properties
  getFeaturedProperties: async () => {
    const response = await api.get('/properties/featured/');
    return response.data;
  },
};

export const bookingsAPI = {
  // Create booking
  createBooking: async (bookingData: {
    property: string;
    check_in: string;
    check_out: string;
    guests: number;
    contact_phone?: string;
    contact_email?: string;
    special_requests?: string;
  }) => {
    const response = await api.post('/bookings/', bookingData);
    return response.data;
  },
  
  // Get user bookings
  getBookings: async (params?: {
    status?: string;
    payment_status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/bookings/', { params });
    return response.data;
  },
  
  // Get single booking
  getBooking: async (id: number): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}/`);
    return response.data;
  },
  
  // User Actions
  userConfirmBooking: async (id: number) => {
    const response = await api.post(`/bookings/${id}/user_confirm/`);
    return response.data;
  },

  userCompleteBooking: async (id: number) => {
    const response = await api.post(`/bookings/${id}/user_complete/`);
    return response.data;
  },

  // Cancel booking (with 2% deduction)
  cancelBooking: async (id: number, reason?: string) => {
    const response = await api.post(`/bookings/${id}/cancel/`, { 
      reason
    });
    return response.data;
  },

  // Get detailed receipt
  getReceipt: async (id: number) => {
    const response = await api.get(`/bookings/${id}/receipt/`);
    return response.data;
  },

  // Admin Actions (Staff Only)
  adminConfirmBooking: async (id: number) => {
    const response = await api.post(`/bookings/${id}/confirm/`);
    return response.data;
  },

  adminCompleteBooking: async (id: number) => {
    const response = await api.post(`/bookings/${id}/complete/`);
    return response.data;
  },

  adminCancelBooking: async (id: number) => {
    const response = await api.post(`/bookings/${id}/admin_cancel/`);
    return response.data;
  },
  
  // Request refund
  requestRefund: async (id: number, reason: string) => {
    const response = await api.post(`/bookings/${id}/refund/`, { reason });
    return response.data;
  },
  
  // Process payment
  processPayment: async (bookingId: number, paymentData: {
    payment_method: 'credit_card' | 'bank_transfer' | 'jazz_cash' | 'easy_paisa';
    card_number?: string;
    expiry_date?: string;
    cvv?: string;
    cardholder_name?: string;
    billing_address?: string;
    bank_account?: string;
    transaction_id?: string;
    phone_number?: string;
  }) => {
    const response = await api.post(`/bookings/${bookingId}/payment/`, paymentData);
    return response.data;
  },
  
  // Verify payment
  verifyPayment: async (bookingId: number, transactionId: string) => {
    const response = await api.post(`/bookings/${bookingId}/verify-payment/`, { transaction_id: transactionId });
    return response.data;
  },
  
  // Confirm booking (admin)
  confirmBooking: async (id: number) => {
    const response = await api.patch(`/bookings/${id}/`, { status: 'confirmed' });
    return response.data;
  },
  
  // Get booking invoice
  getInvoice: async (id: number) => {
    const response = await api.get(`/bookings/${id}/invoice/`, { responseType: 'blob' });
    return response.data;
  },
  
  // Send booking confirmation
  sendConfirmation: async (id: number, method: 'email' | 'whatsapp' | 'both') => {
    const response = await api.post(`/bookings/${id}/send-confirmation/`, { method });
    return response.data;
  },
};

export const reviewsAPI = {
  // Get property reviews
  getPropertyReviews: async (propertyId: number, params?: {
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get(`/properties/${propertyId}/reviews/`, { params });
    return response.data;
  },
  
  // Create review
  createReview: async (reviewData: {
    property: number;
    rating: number;
    comment: string;
  }) => {
    const response = await api.post('/reviews/', reviewData);
    return response.data;
  },
  
  // Update review
  updateReview: async (id: number, reviewData: {
    rating?: number;
    comment?: string;
  }) => {
    const response = await api.patch(`/reviews/${id}/`, reviewData);
    return response.data;
  },
  
  // Delete review
  deleteReview: async (id: number) => {
    await api.delete(`/reviews/${id}/`);
  },
};

// Utility functions
export const notificationsAPI = {
  // Get all notifications
  getNotifications: async (params?: {
    is_read?: boolean;
    type?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/notifications/notifications/', { params });
    return response.data;
  },
  
  // Get unread notifications count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/notifications/unread_count/');
    return response.data.unread_count;
  },
  
  // Mark notification as read
  markAsRead: async (id: number) => {
    const response = await api.post(`/notifications/notifications/${id}/mark_read/`);
    return response.data;
  },
  
  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.post('/notifications/notifications/mark_all_read/');
    return response.data;
  },
  
  // Delete notification (admin only)
  deleteNotification: async (id: number) => {
    await api.delete(`/notifications/notifications/${id}/`);
  },
  
  // Subscribe to WhatsApp notifications
  subscribeWhatsApp: async (phone: string) => {
    const response = await api.post('/notifications/subscribe-whatsapp/', { phone });
    return response.data;
  },
  
  // Unsubscribe from WhatsApp notifications
  unsubscribeWhatsApp: async () => {
    const response = await api.post('/notifications/unsubscribe-whatsapp/');
    return response.data;
  },
};

// Booking Status Management API
export const bookingStatusAPI = {
  // Admin: Update booking status
  updateStatus: async (bookingId: string, status: string, reason?: string) => {
    const response = await api.post(`/notifications/booking-status/${bookingId}/update_status/`, { 
      status, 
      reason,
      admin_notes: reason 
    });
    return response.data;
  },
  
  // User: Cancel booking with refund
  cancelBooking: async (bookingId: string, reason?: string, requestRefund: boolean = true) => {
    const response = await api.post(`/notifications/booking-status/${bookingId}/cancel_booking/`, { 
      reason, 
      request_refund: requestRefund 
    });
    return response.data;
  },
  
  // Get booking status history
  getStatusHistory: async (bookingId: string) => {
    const response = await api.get(`/notifications/booking-status/${bookingId}/status_history/`);
    return response.data;
  },
};

export const paymentAPI = {
  // Get available payment methods
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods/');
    return response.data as PaymentMethod[];
  },
  
  // Get payment transactions
  getTransactions: async (params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/payments/transactions/', { params });
    return response.data;
  },
  
  // Get single transaction
  getTransaction: async (id: string) => {
    const response = await api.get(`/payments/transactions/${id}/`);
    return response.data as PaymentTransaction;
  },
  
  // Generate payment receipt
  getReceipt: async (id: string) => {
    const response = await api.get(`/payments/transactions/${id}/receipt/`, { responseType: 'blob' });
    return response.data;
  },
  
  // Calculate booking price with fees
  calculatePrice: async (data: {
    property_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    payment_method?: string;
  }) => {
    const response = await api.post('/bookings/calculate_price/', data);
    return response.data;
  },
};

export const adminAPI = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/');
    return response.data;
  },
  
  // Manage properties
  getProperties: async (params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/admin/properties/', { params });
    return response.data;
  },
  
  updateProperty: async (id: number, data: Partial<Property>) => {
    const response = await api.patch(`/admin/properties/${id}/`, data);
    return response.data;
  },
  
  // Manage bookings
  getBookings: async (params?: {
    status?: string;
    payment_status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/admin/bookings/', { params });
    return response.data;
  },
  
  updateBooking: async (id: number, data: Partial<Booking>) => {
    const response = await api.patch(`/admin/bookings/${id}/`, data);
    return response.data;
  },
  
  // Manage users
  getUsers: async (params?: {
    is_active?: boolean;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/admin/users/', { params });
    return response.data;
  },
  
  updateUser: async (id: number, data: Partial<User>) => {
    const response = await api.patch(`/admin/users/${id}/`, data);
    return response.data;
  },
  
  // Manage payments
  getPayments: async (params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }) => {
    const response = await api.get('/admin/payments/', { params });
    return response.data;
  },
  
  processRefund: async (transactionId: string, amount?: number) => {
    const response = await api.post(`/admin/payments/${transactionId}/refund/`, { amount });
    return response.data;
  },
};

export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (status === 400) {
      return data.detail || 'Invalid request data';
    } else if (status === 401) {
      return 'Authentication required';
    } else if (status === 403) {
      return 'Permission denied';
    } else if (status === 404) {
      return 'Resource not found';
    } else if (status === 500) {
      return 'Server error. Please try again later';
    }
    
    return data.detail || `Error ${status}`;
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

// Favorites API
export const favoritesAPI = {
  getFavorites: async () => {
    const response = await api.get('/auth/favorites/');
    return response.data;
  },
  addToFavorites: async (propertyId: string) => {
    const response = await api.post('/auth/favorites/', { property: propertyId });
    return response.data;
  },
  removeFromFavorites: async (propertyId: string) => {
    const response = await api.delete(`/auth/favorites/${propertyId}/`);
    return response.data;
  },
  isFavorite: async (propertyId: string) => {
    try {
      const response = await api.get(`/auth/favorites/${propertyId}/check/`);
      return response.data.is_favorite;
    } catch (error) {
      return false;
    }
  },
};

export default api; 