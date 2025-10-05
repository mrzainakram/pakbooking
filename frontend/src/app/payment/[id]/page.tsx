'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CreditCard, Shield, CheckCircle, AlertCircle, ArrowLeft,
  Phone, Mail, MessageCircle, Clock, DollarSign, Lock,
  Smartphone, Building2, Banknote
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { bookingsAPI, paymentAPI, handleAPIError } from '@/lib/api';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'jazz_cash' | 'easy_paisa';
  title: string;
  description: string;
  icon: React.ReactNode;
  processing_fee: number;
  is_active: boolean;
}

interface PaymentFormData {
  payment_method: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  cardholder_name: string;
  billing_address: string;
  bank_account: string;
  transaction_id: string;
  phone_number: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    payment_method: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
    cardholder_name: '',
    billing_address: '',
    bank_account: '',
    transaction_id: '',
    phone_number: ''
  });

  // Default payment methods
  const defaultPaymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      type: 'credit_card',
      title: 'Credit/Debit Card',
      description: 'Visa, MasterCard, American Express',
      icon: <CreditCard className="w-6 h-6" />,
      processing_fee: 50,
      is_active: true
    },
    {
      id: 'jazz_cash',
      type: 'jazz_cash',
      title: 'JazzCash',
      description: 'Pay with your JazzCash wallet',
      icon: <Smartphone className="w-6 h-6" />,
      processing_fee: 25,
      is_active: true
    },
    {
      id: 'easy_paisa',
      type: 'easy_paisa',
      title: 'EasyPaisa',
      description: 'Pay with your EasyPaisa wallet',
      icon: <Smartphone className="w-6 h-6" />,
      processing_fee: 25,
      is_active: true
    },
    {
      id: 'bank_transfer',
      type: 'bank_transfer',
      title: 'Bank Transfer',
      description: 'Direct bank account transfer',
      icon: <Building2 className="w-6 h-6" />,
      processing_fee: 0,
      is_active: true
    }
  ];

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!isAuthenticated) {
          router.push('/auth');
          return;
        }

        const bookingData = await bookingsAPI.getBooking(Number(params.id));
        setBooking(bookingData);

        // Try to fetch payment methods from API, fallback to default
        try {
          const methods = await paymentAPI.getPaymentMethods();
          setPaymentMethods(methods);
        } catch {
          setPaymentMethods(defaultPaymentMethods);
        }
      } catch (error) {
        toast.error(handleAPIError(error));
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBooking();
    }
  }, [params.id, router, isAuthenticated]);

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentData({...paymentData, payment_method: methodId});
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setPaymentLoading(true);
    try {
      // Process payment
      const paymentResult = await bookingsAPI.processPayment(booking.id, paymentData);
      
      if (paymentResult.status === 'completed') {
        toast.success('Payment successful! Booking confirmed.');
        
        // Send confirmation notifications
        await bookingsAPI.sendConfirmation(booking.id, 'both');
        
        // Redirect to booking confirmation
        router.push(`/booking-confirmation/${booking.id}`);
      } else if (paymentResult.status === 'processing') {
        toast.loading('Payment is being processed...');
        
        // Redirect to payment status page
        router.push(`/payment-status/${paymentResult.transaction_id}`);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error(handleAPIError(error));
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking not found</h2>
          <Link href="/dashboard" className="text-primary-400 hover:text-primary-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const totalWithFee = booking.total_price + (selectedPaymentMethod?.processing_fee || 0);

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
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Spacer for navbar */}
      <div className="navbar-spacer"></div>

      {/* Payment Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-full mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary-400" />
              </div>
              <h1 className="text-4xl font-display font-black text-white mb-4">
                Secure Payment
              </h1>
              <p className="text-xl text-gray-400">
                Complete your booking payment securely
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Summary */}
              <div className="lg:col-span-1">
                <div className="card-dark p-6 sticky top-32">
                  <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {booking.property.title.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{booking.property.title}</h4>
                        <p className="text-gray-400 text-sm">{booking.property.city}</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Check-in:</span>
                        <span>{new Date(booking.check_in).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Check-out:</span>
                        <span>{new Date(booking.check_out).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Guests:</span>
                        <span>{booking.guests}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Booking ID:</span>
                        <span>#{booking.id}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-300">
                        <span>Subtotal:</span>
                        <span>₨{booking.total_price.toLocaleString()}</span>
                      </div>
                      {selectedPaymentMethod && selectedPaymentMethod.processing_fee > 0 && (
                        <div className="flex justify-between text-gray-300">
                          <span>Processing Fee:</span>
                          <span>₨{selectedPaymentMethod.processing_fee}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-2">
                        <span>Total:</span>
                        <span>₨{totalWithFee.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Cancellation Policy */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="font-bold text-white mb-2">Cancellation Policy</h4>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>• Free cancellation up to 24 hours before check-in</p>
                        <p>• Cancellation fee: ₨500 after 24 hours</p>
                        <p>• No refund for no-shows</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods & Form */}
              <div className="lg:col-span-2">
                {!showPaymentForm ? (
                  /* Payment Method Selection */
                  <div className="card-dark p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Choose Payment Method</h3>
                    
                    <div className="grid gap-4">
                      {paymentMethods.filter(method => method.is_active).map((method) => (
                        <motion.button
                          key={method.id}
                          onClick={() => handlePaymentMethodSelect(method.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedMethod === method.id
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-primary-400">
                                {method.icon}
                              </div>
                              <div>
                                <h4 className="font-bold text-white">{method.title}</h4>
                                <p className="text-gray-400 text-sm">{method.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              {method.processing_fee > 0 ? (
                                <div className="text-sm text-gray-400">
                                  +₨{method.processing_fee} fee
                                </div>
                              ) : (
                                <div className="text-sm text-green-400">No fee</div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-6 h-6 text-green-400" />
                        <div>
                          <h4 className="font-bold text-green-400">Secure Payment</h4>
                          <p className="text-green-300 text-sm">
                            Your payment information is encrypted and secure. We never store your card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Payment Form */
                  <div className="card-dark p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Payment Details</h3>
                      <button
                        onClick={() => setShowPaymentForm(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      {selectedPaymentMethod?.type === 'credit_card' && (
                        <>
                          {/* Card Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Card Number
                            </label>
                            <div className="relative">
                              <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                              <input
                                type="text"
                                value={paymentData.card_number}
                                onChange={(e) => setPaymentData({
                                  ...paymentData, 
                                  card_number: formatCardNumber(e.target.value)
                                })}
                                className="input-3d-dark pl-12 w-full"
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Expiry Date */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={paymentData.expiry_date}
                                onChange={(e) => setPaymentData({
                                  ...paymentData, 
                                  expiry_date: formatExpiryDate(e.target.value)
                                })}
                                className="input-3d-dark w-full"
                                placeholder="MM/YY"
                                maxLength={5}
                                required
                              />
                            </div>

                            {/* CVV */}
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                value={paymentData.cvv}
                                onChange={(e) => setPaymentData({
                                  ...paymentData, 
                                  cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                                })}
                                className="input-3d-dark w-full"
                                placeholder="123"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>

                          {/* Cardholder Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              value={paymentData.cardholder_name}
                              onChange={(e) => setPaymentData({
                                ...paymentData, 
                                cardholder_name: e.target.value
                              })}
                              className="input-3d-dark w-full"
                              placeholder="John Doe"
                              required
                            />
                          </div>

                          {/* Billing Address */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Billing Address
                            </label>
                            <textarea
                              value={paymentData.billing_address}
                              onChange={(e) => setPaymentData({
                                ...paymentData, 
                                billing_address: e.target.value
                              })}
                              className="input-3d-dark w-full h-20 resize-none"
                              placeholder="Street address, City, Country"
                              required
                            />
                          </div>
                        </>
                      )}

                      {(selectedPaymentMethod?.type === 'jazz_cash' || selectedPaymentMethod?.type === 'easy_paisa') && (
                        <>
                          {/* Phone Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              {selectedPaymentMethod.title} Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                              <input
                                type="tel"
                                value={paymentData.phone_number}
                                onChange={(e) => setPaymentData({
                                  ...paymentData, 
                                  phone_number: e.target.value
                                })}
                                className="input-3d-dark pl-12 w-full"
                                placeholder="+92 300 1234567"
                                required
                              />
                            </div>
                          </div>

                          {/* Transaction ID */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Transaction ID (After Payment)
                            </label>
                            <input
                              type="text"
                              value={paymentData.transaction_id}
                              onChange={(e) => setPaymentData({
                                ...paymentData, 
                                transaction_id: e.target.value
                              })}
                              className="input-3d-dark w-full"
                              placeholder="Enter transaction ID after payment"
                            />
                          </div>

                          {/* Payment Instructions */}
                          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <h4 className="font-bold text-blue-400 mb-2">Payment Instructions</h4>
                            <ol className="text-blue-300 text-sm space-y-1 list-decimal list-inside">
                              <li>Send ₨{totalWithFee.toLocaleString()} to {selectedPaymentMethod.title}</li>
                              <li>Use your registered phone number</li>
                              <li>Enter the transaction ID above</li>
                              <li>Click "Complete Payment" to verify</li>
                            </ol>
                          </div>
                        </>
                      )}

                      {selectedPaymentMethod?.type === 'bank_transfer' && (
                        <>
                          {/* Bank Account */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Your Bank Account
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-500 w-5 h-5" />
                              <input
                                type="text"
                                value={paymentData.bank_account}
                                onChange={(e) => setPaymentData({
                                  ...paymentData, 
                                  bank_account: e.target.value
                                })}
                                className="input-3d-dark pl-12 w-full"
                                placeholder="Account number"
                                required
                              />
                            </div>
                          </div>

                          {/* Bank Transfer Instructions */}
                          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <h4 className="font-bold text-purple-400 mb-2">Bank Transfer Details</h4>
                            <div className="text-purple-300 text-sm space-y-1">
                              <p><strong>Account Title:</strong> PakBooking Services</p>
                              <p><strong>Account Number:</strong> 1234567890123456</p>
                              <p><strong>Bank:</strong> Allied Bank Limited</p>
                              <p><strong>Branch Code:</strong> 0123</p>
                              <p><strong>Amount:</strong> ₨{totalWithFee.toLocaleString()}</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={paymentLoading}
                        whileHover={{ scale: paymentLoading ? 1 : 1.05 }}
                        whileTap={{ scale: paymentLoading ? 1 : 0.95 }}
                        className="btn-3d w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg flex items-center justify-center space-x-2"
                      >
                        {paymentLoading ? (
                          <>
                            <div className="spinner w-5 h-5"></div>
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-5 h-5" />
                            <span>Complete Payment - ₨{totalWithFee.toLocaleString()}</span>
                          </>
                        )}
                      </motion.button>

                      {/* Contact Support */}
                      <div className="text-center pt-4 border-t border-white/10">
                        <p className="text-gray-400 text-sm mb-2">Need help with payment?</p>
                        <div className="flex justify-center space-x-4">
                          <a
                            href="tel:+923046164257"
                            className="flex items-center space-x-1 text-primary-400 hover:text-primary-300"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Call Support</span>
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
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

