'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Star, MapPin, Users, Calendar, Wifi, Car, Coffee, 
  Dumbbell, Waves, Mountain, ArrowLeft, Heart, Share2,
  CreditCard, Phone, Mail, MessageCircle, CheckCircle,
  AlertCircle, Clock, Shield
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { propertiesAPI, bookingsAPI, paymentAPI, handleAPIError } from '@/lib/api';
import SafeImage from '@/components/ui/SafeImage';
import toast from 'react-hot-toast';

interface BookingFormData {
  check_in: string;
  check_out: string;
  guests: number;
  contact_phone: string;
  contact_email: string;
  special_requests: string;
}

export default function HotelDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availability, setAvailability] = useState<any>(null);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);

  const [bookingData, setBookingData] = useState<BookingFormData>({
    check_in: '',
    check_out: '',
    guests: 1,
    contact_phone: '',
    contact_email: user?.email || '',
    special_requests: ''
  });

  // Fetch hotel details
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await propertiesAPI.getProperty(params.id);
        setHotel(data);
      } catch (error) {
        toast.error(handleAPIError(error));
        router.push('/hotels');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchHotel();
    }
  }, [params.id, router]);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (hotel && bookingData.check_in && bookingData.check_out) {
        try {
          const availabilityData = await propertiesAPI.getAvailability(
            hotel.id,
            bookingData.check_in,
            bookingData.check_out
          );
          setAvailability(availabilityData);

          // Calculate price using API
          try {
            const priceData = await paymentAPI.calculatePrice({
              property_id: hotel.id,
              check_in: bookingData.check_in,
              check_out: bookingData.check_out,
              guests: bookingData.guests
            });
            setPriceCalculation(priceData);
          } catch (error) {
            // Fallback to local calculation
            const nights = availabilityData.nights || 1;
            const basePrice = parseFloat(hotel.price_per_night) * nights;
            const taxes = basePrice * 0.05;
            const totalPrice = basePrice + taxes;
            
            setPriceCalculation({
              nights,
              base_price: basePrice,
              taxes,
              total_price: totalPrice,
              price_per_night: parseFloat(hotel.price_per_night)
            });
          }
        } catch (error) {
          console.error('Availability check failed:', error);
        }
      }
    };

    checkAvailability();
  }, [hotel, bookingData.check_in, bookingData.check_out, bookingData.guests]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to make a booking');
      router.push('/auth');
      return;
    }

    if (!availability?.available) {
      toast.error('Hotel is not available for selected dates');
      return;
    }

    setBookingLoading(true);
    try {
      const booking = await bookingsAPI.createBooking({
        property: hotel.id,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: bookingData.guests,
        contact_phone: bookingData.contact_phone,
        contact_email: bookingData.contact_email,
        special_requests: bookingData.special_requests
      });

      // Show congratulations message
      toast.success('🎉 Congratulations! Your booking has been confirmed!', {
        duration: 4000,
        style: {
          background: 'linear-gradient(90deg, #10B981, #3B82F6)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      });
      
      // Show additional success message
      setTimeout(() => {
        toast.success('Check your dashboard for booking details and confirmation email!');
      }, 1000);
      
      // Redirect to dashboard to see booking
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setBookingLoading(false);
    }
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'Parking': <Car className="w-5 h-5" />,
    'Restaurant': <Coffee className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Pool': <Waves className="w-5 h-5" />,
    'Mountain View': <Mountain className="w-5 h-5" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Hotel not found</h2>
          <Link href="/hotels" className="text-primary-400 hover:text-primary-300">
            Back to Hotels
          </Link>
        </div>
      </div>
    );
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
              PakBooking
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/hotels">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Hotels</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for navbar */}
      <div className="navbar-spacer"></div>

      {/* Hotel Images Gallery */}
      <section className="relative">
        <div className="aspect-[16/9] relative overflow-hidden">
          {hotel.images && hotel.images.length > 0 ? (
            <>
              <SafeImage
                src={hotel.images[currentImageIndex]?.image || hotel.images[0]?.image}
                alt={hotel.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image Navigation */}
              {hotel.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {hotel.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">{hotel.title.charAt(0)}</span>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="glass-dark rounded-full p-3 hover:bg-white/20 transition-colors">
              <Heart className="w-6 h-6 text-white" />
            </button>
            <button className="glass-dark rounded-full p-3 hover:bg-white/20 transition-colors">
              <Share2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Hotel Details */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-display font-black text-white mb-2">
                      {hotel.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-5 h-5" />
                        <span>{hotel.city}, {hotel.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-5 h-5 text-accent-400 fill-current" />
                        <span className="text-white font-bold">{hotel.rating}</span>
                        <span>({hotel.reviews_count} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-white">
                      ₨{hotel.price_per_night.toLocaleString()}
                    </div>
                    <div className="text-gray-400">per night</div>
                  </div>
                </div>

                {/* Description */}
                <div className="card-dark p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">About this hotel</h3>
                  <p className="text-gray-300 leading-relaxed">{hotel.description}</p>
                </div>

                {/* Amenities */}
                <div className="card-dark p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        {amenityIcons[amenity] || <CheckCircle className="w-5 h-5 text-primary-400" />}
                        <span className="text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Hotel Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-400">{hotel.max_guests}</div>
                      <div className="text-gray-400">Max Guests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary-400">{hotel.bedrooms}</div>
                      <div className="text-gray-400">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent-400">{hotel.bathrooms}</div>
                      <div className="text-gray-400">Bathrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {hotel.is_available ? 'Available' : 'Booked'}
                      </div>
                      <div className="text-gray-400">Status</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="sticky top-32"
              >
                <div className="card-dark p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Book Your Stay</h3>
                  
                  {!isAuthenticated ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-accent-500/20 rounded-full mx-auto mb-4">
                        <Shield className="w-8 h-8 text-accent-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Ready to Book?</h4>
                      <p className="text-gray-300 mb-6">
                        You need to be signed in to make hotel reservations. Create an account or log in to continue.
                      </p>
                      
                      <div className="space-y-3">
                        <Link href="/auth">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-3d w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold"
                          >
                            Login & Book Now
                          </motion.button>
                        </Link>
                        
                        <Link href="/auth">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-3d w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold"
                          >
                            Create Account
                          </motion.button>
                        </Link>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h5 className="font-bold text-blue-400 mb-2">Why Sign Up?</h5>
                        <ul className="text-blue-300 text-sm space-y-1 text-left">
                          <li>• Secure booking confirmation</li>
                          <li>• Track your reservations</li>
                          <li>• Instant email & WhatsApp updates</li>
                          <li>• Easy cancellation & refunds</li>
                          <li>• 24/7 customer support</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      {/* Check-in Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Check-in Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                          <input
                            type="date"
                            value={bookingData.check_in}
                            onChange={(e) => setBookingData({...bookingData, check_in: e.target.value})}
                            className="input-3d-dark pl-12 w-full"
                            required
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      {/* Check-out Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Check-out Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-500 w-5 h-5" />
                          <input
                            type="date"
                            value={bookingData.check_out}
                            onChange={(e) => setBookingData({...bookingData, check_out: e.target.value})}
                            className="input-3d-dark pl-12 w-full"
                            required
                            min={bookingData.check_in || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Guests
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent-500 w-5 h-5" />
                          <select
                            value={bookingData.guests}
                            onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
                            className="input-3d-dark pl-12 w-full"
                            required
                          >
                            {Array.from({length: hotel.max_guests}, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>
                                {num} Guest{num > 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Contact Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Contact Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                          <input
                            type="tel"
                            value={bookingData.contact_phone}
                            onChange={(e) => setBookingData({...bookingData, contact_phone: e.target.value})}
                            className="input-3d-dark pl-12 w-full"
                            placeholder="+92 300 1234567"
                            required
                          />
                        </div>
                      </div>

                      {/* Contact Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Contact Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                          <input
                            type="email"
                            value={bookingData.contact_email}
                            onChange={(e) => setBookingData({...bookingData, contact_email: e.target.value})}
                            className="input-3d-dark pl-12 w-full"
                            required
                          />
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          value={bookingData.special_requests}
                          onChange={(e) => setBookingData({...bookingData, special_requests: e.target.value})}
                          className="input-3d-dark w-full h-20 resize-none"
                          placeholder="Any special requirements..."
                        />
                      </div>

                      {/* Availability Status */}
                      {availability && (
                        <div className={`p-3 rounded-lg border ${
                          availability.available 
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {availability.available ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )}
                            <span className="font-medium">
                              {availability.available ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Price Calculation */}
                      {priceCalculation && (
                        <div className="bg-dark-800 p-4 rounded-lg border border-white/10">
                          <h4 className="font-bold text-white mb-3">Price Breakdown</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-300">
                              <span>Base Price ({priceCalculation.nights} nights)</span>
                              <span>₨{priceCalculation.base_price?.toLocaleString()}</span>
                            </div>
                            {priceCalculation.taxes > 0 && (
                              <div className="flex justify-between text-gray-300">
                                <span>Taxes & Fees</span>
                                <span>₨{priceCalculation.taxes?.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
                              <span>Total</span>
                              <span>₨{priceCalculation.total_price?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Book Button */}
                      <motion.button
                        type="submit"
                        disabled={bookingLoading || (availability && !availability.available)}
                        whileHover={{ scale: availability?.available ? 1.05 : 1 }}
                        whileTap={{ scale: availability?.available ? 0.95 : 1 }}
                        className={`btn-3d w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 ${
                          availability?.available 
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-glow'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {bookingLoading ? (
                          <>
                            <div className="spinner w-5 h-5"></div>
                            <span>Processing...</span>
                          </>
                        ) : availability?.available ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirm Booking</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5" />
                            <span>Not Available</span>
                          </>
                        )}
                      </motion.button>

                      {/* Booking Process Guide */}
                      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-white/10">
                        <h5 className="font-bold text-white mb-3">📋 Booking Process</h5>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">1</span>
                            <span>Fill booking details above</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                            <span>Review and confirm booking</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
                            <span>Choose payment method</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">4</span>
                            <span>Get confirmation via email/WhatsApp</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="text-center pt-4 border-t border-white/10">
                        <p className="text-gray-400 text-sm mb-2">Need help?</p>
                        <div className="flex justify-center space-x-4">
                          <a
                            href="tel:+923046164257"
                            className="flex items-center space-x-1 text-primary-400 hover:text-primary-300"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Call</span>
                          </a>
                          <a
                            href="https://wa.me/923046164257"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-green-400 hover:text-green-300"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

