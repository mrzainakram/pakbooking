'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  language: 'en' | 'ur' | 'roman';
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'ur' | 'roman') => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.hotels': 'Hotels',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin Panel',
    'nav.signin': 'Sign In',
    'nav.getstarted': 'Get Started',
    'nav.logout': 'Logout',
    
    // Common
    'common.search': 'Search',
    'common.book': 'Book Now',
    'common.confirm': 'Confirm Booking',
    'common.cancel': 'Cancel',
    'common.back': 'Back to Home',
    'common.loading': 'Loading...',
    
    // Booking
    'booking.congratulations': '🎉 Congratulations! Your booking has been confirmed!',
    'booking.success': 'Check your dashboard for booking details and confirmation email!',
    'booking.pending': 'Pending',
    'booking.confirmed': 'Confirmed',
    'booking.cancelled': 'Cancelled',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.manage': 'Manage your bookings and account settings',
    
    // About Page
    'about.title': 'About PakBooking',
    'about.subtitle': 'Pakistan\'s premier hotel booking platform, revolutionizing the way travelers discover and book accommodations across the country with cutting-edge technology.',
    'about.story.title': 'Our Story',
    'about.story.desc1': 'PakBooking was created with a vision to transform the hotel booking experience in Pakistan. We combine innovative technology with deep understanding of Pakistani hospitality to create a seamless booking platform for travelers.',
    'about.story.desc2': 'Our platform connects travelers with the finest accommodations across Pakistan, from luxury hotels in major cities to boutique resorts in scenic locations. We\'re committed to making hotel booking simple, secure, and enjoyable for every traveler.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To provide travelers with the most comprehensive and user-friendly hotel booking platform in Pakistan, ensuring seamless experiences from search to stay.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'To become Pakistan\'s most trusted hotel booking platform, connecting millions of travelers with exceptional accommodations across the country.',
    'about.stats.experience': 'Years Experience',
    'about.stats.clients': 'Happy Clients',
    'about.stats.projects': 'Projects Completed',
    'about.stats.support': 'Support',
    'about.services.title': 'Our Services',
    'about.services.subtitle': 'Comprehensive technology solutions tailored to your business needs',
    'about.services.booking.title': 'Hotel Booking',
    'about.services.booking.desc': 'Easy and secure hotel reservations across Pakistan',
    'about.services.confirmation.title': 'Instant Confirmation',
    'about.services.confirmation.desc': 'Real-time booking confirmations and instant receipts',
    'about.services.payments.title': 'Secure Payments',
    'about.services.payments.desc': '100% secure payment processing and data protection',
    'about.why.title': 'Why Choose PakBooking?',
    'about.why.expert.title': 'Expert Team',
    'about.why.expert.desc': 'Experienced developers and designers',
    'about.why.standards.title': 'Global Standards',
    'about.why.standards.desc': 'International quality and best practices',
    'about.why.support.title': '24/7 Support',
    'about.why.support.desc': 'Always available for your needs',
    
    // Contact Page
    'contact.title': 'Contact PakBooking',
    'contact.subtitle': 'Have questions about hotel bookings or need assistance? We\'re here to help! Get in touch with our team for personalized support and travel recommendations.',
    'contact.form.title': 'Send us a Message',
    'contact.form.subtitle': 'Fill out the form below and we\'ll get back to you as soon as possible.',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.send': 'Send Message',
    'contact.form.success': 'Thank you for your message! We will get back to you soon.',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',
    'contact.info.whatsapp': 'WhatsApp',
    'contact.info.hours': 'Business Hours',
    'contact.info.hours.value': '24/7 Available',
    'contact.info.hours.desc': 'We\'re here whenever you need us',
    'contact.info.phone.desc': 'Call us for immediate assistance',
    'contact.info.email.desc': 'Send us your queries anytime',
    'contact.info.whatsapp.desc': 'Chat with us',
    'contact.info.whatsapp.text': 'Direct WhatsApp support for instant help',
    'contact.why.title': 'Why Choose PakBooking?',
    'contact.why.expert.title': 'Expert Team',
    'contact.why.expert.desc': 'Experienced developers and designers',
    'contact.why.standards.title': 'Global Standards',
    'contact.why.standards.desc': 'International quality and best practices',
    'contact.why.support.title': '24/7 Support',
    'contact.why.support.desc': 'Always available for your needs',
    'contact.quick.title': 'Quick Contact',
    
    // Homepage
    'home.hero.title': 'Discover Pakistan\'s Finest Hotels',
    'home.hero.subtitle': 'Book your perfect stay with PakBooking - from luxury resorts to cozy guesthouses across Pakistan',
    'home.cards.luxury.title': 'Luxury Escapes',
    'home.cards.luxury.desc': 'Premium hotels and resorts for unforgettable experiences',
    'home.cards.family.title': 'Family Getaways',
    'home.cards.family.desc': 'Perfect accommodations for memorable family vacations',
    'home.cards.adventure.title': 'Adventure Stays',
    'home.cards.adventure.desc': 'Unique locations for thrill-seekers and nature lovers',
    'home.cta.search': 'Search All Hotels',
    'home.cta.explore': 'Explore',
    
    // Homepage Additional Sections
    'home.slides.unforgettable.title': 'Unforgettable Experiences',
    'home.slides.unforgettable.subtitle': 'From mountains to cities, find your perfect stay',
    'home.slides.confidence.title': 'Book with Confidence',
    'home.slides.confidence.subtitle': 'Secure payments and instant confirmations',
    'home.stats.hotels': 'Premium Hotels',
    'home.stats.guests': 'Happy Guests',
    'home.stats.cities': 'Cities',
    'home.stats.satisfaction': 'Satisfaction',
    'home.featured.title': 'Featured Hotels',
    'home.featured.subtitle': 'Discover our handpicked selection of premium accommodations across Pakistan',
    'home.featured.viewall': 'View All Hotels',
    'home.why.title': 'Why Choose PakBooking?',
    'home.why.subtitle': 'Experience the best hotel booking platform in Pakistan with premium features',
    'home.why.secure.title': 'Secure Booking',
    'home.why.secure.desc': '100% secure payments with instant confirmation',
    'home.why.instant.title': 'Instant Confirmation',
    'home.why.instant.desc': 'Get booking confirmation within seconds',
    'home.why.prices.title': 'Best Prices',
    'home.why.prices.desc': 'Guaranteed lowest prices with exclusive deals',
    'home.search.title': 'Find Your Perfect Hotel',
    'home.search.destination': 'Destination',
    'home.search.destination.placeholder': 'Where to?',
    'home.search.checkin': 'Check In',
    'home.search.checkout': 'Check Out',
    'home.search.guests': 'Guests',
    'home.search.button': 'Search Hotels',
    'home.available.title': 'Available Hotels',
    'home.available.filters': 'Filters',
    'home.footer.tagline': 'Pakistan\'s premier hotel booking platform. Discover luxury accommodations and create unforgettable memories across the country.',
    'home.footer.links.about': 'About',
    'home.footer.links.hotels': 'Hotels',
    'home.footer.links.contact': 'Contact',
    'home.footer.links.privacy': 'Privacy',
    'home.footer.links.terms': 'Terms',
    'home.footer.copyright': '© 2024 PakBooking. All rights reserved. Built with ❤️ in Pakistan.'
  },
  ur: {
    // Navigation
    'nav.home': 'گھر',
    'nav.hotels': 'ہوٹلز',
    'nav.about': 'ہمارے بارے میں',
    'nav.contact': 'رابطہ',
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.admin': 'ایڈمن پینل',
    'nav.signin': 'سائن ان',
    'nav.getstarted': 'شروع کریں',
    'nav.logout': 'لاگ آؤٹ',
    
    // Common
    'common.search': 'تلاش',
    'common.book': 'بک کریں',
    'common.confirm': 'بکنگ کی تصدیق',
    'common.cancel': 'منسوخ',
    'common.back': 'گھر واپس',
    'common.loading': 'لوڈ ہو رہا ہے...',
    
    // Booking
    'booking.congratulations': '🎉 مبارک ہو! آپ کی بکنگ کی تصدیق ہو گئی!',
    'booking.success': 'بکنگ کی تفصیلات کے لیے اپنا ڈیش بورڈ چیک کریں!',
    'booking.pending': 'زیر التواء',
    'booking.confirmed': 'تصدیق شدہ',
    'booking.cancelled': 'منسوخ شدہ',
    
    // Dashboard
    'dashboard.welcome': 'خوش آمدید',
    'dashboard.manage': 'اپنی بکنگز اور اکاؤنٹ کی سیٹنگز کا انتظام کریں',
    
    // About Page
    'about.title': 'پاک بکنگ کے بارے میں',
    'about.subtitle': 'پاکستان کا بہترین ہوٹل بکنگ پلیٹ فارم، جو جدید ٹیکنالوجی کے ساتھ مسافروں کے لیے ملک بھر میں رہائش تلاش کرنے اور بک کرنے کے طریقے میں انقلاب لا رہا ہے۔',
    'about.story.title': 'ہماری کہانی',
    'about.story.desc1': 'پاک بکنگ پاکستان میں ہوٹل بکنگ کے تجربے کو تبدیل کرنے کے وژن کے ساتھ بنایا گیا تھا۔ ہم جدید ٹیکنالوجی کو پاکستانی مہمان نوازی کی گہری سمجھ کے ساتھ ملا کر مسافروں کے لیے ایک بہترین بکنگ پلیٹ فارم بناتے ہیں۔',
    'about.story.desc2': 'ہمارا پلیٹ فارم مسافروں کو پاکستان بھر کی بہترین رہائش سے جوڑتا ہے، بڑے شہروں کے لگژری ہوٹلوں سے لے کر خوبصورت مقامات کے بوتیک ریزورٹس تک۔ ہم ہر مسافر کے لیے ہوٹل بکنگ کو آسان، محفوظ اور خوشگوار بنانے کے لیے پرعزم ہیں۔',
    'about.mission.title': 'ہمارا مشن',
    'about.mission.desc': 'مسافروں کو پاکستان میں سب سے جامع اور صارف دوست ہوٹل بکنگ پلیٹ فارم فراہم کرنا، تلاش سے قیام تک بہترین تجربات کو یقینی بنانا۔',
    'about.vision.title': 'ہمارا وژن',
    'about.vision.desc': 'پاکستان کا سب سے قابل اعتماد ہوٹل بکنگ پلیٹ فارم بننا، لاکھوں مسافروں کو ملک بھر کی بہترین رہائش سے جوڑنا۔',
    'about.stats.experience': 'سال تجربہ',
    'about.stats.clients': 'خوش کلائنٹس',
    'about.stats.projects': 'مکمل پروجیکٹس',
    'about.stats.support': 'سپورٹ',
    'about.services.title': 'ہماری خدمات',
    'about.services.subtitle': 'آپ کی کاروباری ضروریات کے مطابق جامع ٹیکنالوجی حل',
    'about.services.booking.title': 'ہوٹل بکنگ',
    'about.services.booking.desc': 'پاکستان بھر میں آسان اور محفوظ ہوٹل ریزرویشن',
    'about.services.confirmation.title': 'فوری تصدیق',
    'about.services.confirmation.desc': 'ریئل ٹائم بکنگ کنفرمیشن اور فوری رسیدیں',
    'about.services.payments.title': 'محفوظ ادائیگی',
    'about.services.payments.desc': '100% محفوظ پیمنٹ پروسیسنگ اور ڈیٹا پروٹیکشن',
    'about.why.title': 'پاک بکنگ کیوں منتخب کریں؟',
    'about.why.expert.title': 'ماہر ٹیم',
    'about.why.expert.desc': 'تجربہ کار ڈویلپرز اور ڈیزائنرز',
    'about.why.standards.title': 'عالمی معیار',
    'about.why.standards.desc': 'بین الاقوامی کوالٹی اور بہترین طریقے',
    'about.why.support.title': '24/7 سپورٹ',
    'about.why.support.desc': 'آپ کی ضروریات کے لیے ہمیشہ دستیاب',
    
    // Contact Page
    'contact.title': 'پاک بکنگ سے رابطہ',
    'contact.subtitle': 'ہوٹل بکنگ کے بارے میں سوالات ہیں یا مدد چاہیے؟ ہم یہاں مدد کے لیے ہیں! ذاتی سپورٹ اور سفری تجاویز کے لیے ہماری ٹیم سے رابطہ کریں۔',
    'contact.form.title': 'ہمیں پیغام بھیجیں',
    'contact.form.subtitle': 'نیچے دیا گیا فارم بھریں اور ہم جلد از جلد آپ سے رابطہ کریں گے۔',
    'contact.form.name': 'مکمل نام',
    'contact.form.email': 'ای میل ایڈریس',
    'contact.form.phone': 'فون نمبر',
    'contact.form.subject': 'موضوع',
    'contact.form.message': 'آپ کا پیغام',
    'contact.form.send': 'پیغام بھیجیں',
    'contact.form.success': 'آپ کے پیغام کا شکریہ! ہم جلد آپ سے رابطہ کریں گے۔',
    'contact.info.phone': 'فون',
    'contact.info.email': 'ای میل',
    'contact.info.whatsapp': 'واٹس ایپ',
    'contact.info.hours': 'کاروباری اوقات',
    'contact.info.hours.value': '24/7 دستیاب',
    'contact.info.hours.desc': 'جب بھی آپ کو ضرورت ہو ہم یہاں ہیں',
    'contact.info.phone.desc': 'فوری مدد کے لیے ہمیں کال کریں',
    'contact.info.email.desc': 'کسی بھی وقت اپنے سوالات بھیجیں',
    'contact.info.whatsapp.desc': 'ہمارے ساتھ چیٹ کریں',
    'contact.info.whatsapp.text': 'فوری مدد کے لیے براہ راست واٹس ایپ سپورٹ',
    'contact.why.title': 'پاک بکنگ کیوں منتخب کریں؟',
    'contact.why.expert.title': 'ماہر ٹیم',
    'contact.why.expert.desc': 'تجربہ کار ڈویلپرز اور ڈیزائنرز',
    'contact.why.standards.title': 'عالمی معیار',
    'contact.why.standards.desc': 'بین الاقوامی کوالٹی اور بہترین طریقے',
    'contact.why.support.title': '24/7 سپورٹ',
    'contact.why.support.desc': 'آپ کی ضروریات کے لیے ہمیشہ دستیاب',
    'contact.quick.title': 'فوری رابطہ',
    
    // Homepage
    'home.hero.title': 'پاکستان کے بہترین ہوٹلز دریافت کریں',
    'home.hero.subtitle': 'پاک بکنگ کے ساتھ اپنا بہترین قیام بک کریں - لگژری ریزورٹس سے لے کر پاکستان بھر کے آرام دہ گیسٹ ہاؤسز تک',
    'home.cards.luxury.title': 'لگژری فرار',
    'home.cards.luxury.desc': 'یادگار تجربات کے لیے پریمیم ہوٹلز اور ریزورٹس',
    'home.cards.family.title': 'خاندانی چھٹیاں',
    'home.cards.family.desc': 'یادگار خاندانی چھٹیوں کے لیے بہترین رہائش',
    'home.cards.adventure.title': 'ایڈونچر قیام',
    'home.cards.adventure.desc': 'سنسنی خیز اور فطرت کے محبوں کے لیے منفرد مقامات',
    'home.cta.search': 'تمام ہوٹلز تلاش کریں',
    'home.cta.explore': 'دریافت کریں',
    
    // Homepage Additional Sections
    'home.slides.unforgettable.title': 'یادگار تجربات',
    'home.slides.unforgettable.subtitle': 'پہاڑوں سے شہروں تک، اپنا بہترین قیام تلاش کریں',
    'home.slides.confidence.title': 'اعتماد کے ساتھ بک کریں',
    'home.slides.confidence.subtitle': 'محفوظ ادائیگی اور فوری تصدیق',
    'home.stats.hotels': 'پریمیم ہوٹلز',
    'home.stats.guests': 'خوش مہمان',
    'home.stats.cities': 'شہر',
    'home.stats.satisfaction': 'اطمینان',
    'home.featured.title': 'خصوصی ہوٹلز',
    'home.featured.subtitle': 'پاکستان بھر میں ہمارے منتخب کردہ پریمیم رہائش کی دریافت کریں',
    'home.featured.viewall': 'تمام ہوٹلز دیکھیں',
    'home.why.title': 'پاک بکنگ کیوں منتخب کریں؟',
    'home.why.subtitle': 'پریمیم فیچرز کے ساتھ پاکستان کا بہترین ہوٹل بکنگ پلیٹ فارم کا تجربہ کریں',
    'home.why.secure.title': 'محفوظ بکنگ',
    'home.why.secure.desc': 'فوری تصدیق کے ساتھ 100% محفوظ ادائیگی',
    'home.why.instant.title': 'فوری تصدیق',
    'home.why.instant.desc': 'سیکنڈوں میں بکنگ کی تصدیق حاصل کریں',
    'home.why.prices.title': 'بہترین قیمتیں',
    'home.why.prices.desc': 'خصوصی ڈیلز کے ساتھ کم سے کم قیمت کی ضمانت',
    'home.search.title': 'اپنا بہترین ہوٹل تلاش کریں',
    'home.search.destination': 'منزل',
    'home.search.destination.placeholder': 'کہاں جانا ہے؟',
    'home.search.checkin': 'چیک ان',
    'home.search.checkout': 'چیک آؤٹ',
    'home.search.guests': 'مہمان',
    'home.search.button': 'ہوٹلز تلاش کریں',
    'home.available.title': 'دستیاب ہوٹلز',
    'home.available.filters': 'فلٹرز',
    'home.footer.tagline': 'پاکستان کا بہترین ہوٹل بکنگ پلیٹ فارم۔ لگژری رہائش دریافت کریں اور ملک بھر میں یادگار یادیں بنائیں۔',
    'home.footer.links.about': 'ہمارے بارے میں',
    'home.footer.links.hotels': 'ہوٹلز',
    'home.footer.links.contact': 'رابطہ',
    'home.footer.links.privacy': 'پرائیویسی',
    'home.footer.links.terms': 'شرائط',
    'home.footer.copyright': '© 2024 پاک بکنگ۔ تمام حقوق محفوظ ہیں۔ پاکستان میں ❤️ کے ساتھ بنایا گیا۔',
    
    // Hotels Page
    'hotels.search.title': 'اپنا بہترین ہوٹل تلاش کریں',
    'hotels.search.destination': 'منزل',
    'hotels.search.destination.placeholder': 'کہاں جانا ہے؟',
    'hotels.search.checkin': 'چیک ان',
    'hotels.search.checkout': 'چیک آؤٹ',
    'hotels.search.guests': 'مہمان',
    'hotels.search.button': 'ہوٹلز تلاش کریں',
    'hotels.available.title': 'دستیاب ہوٹلز',
    'hotels.available.filters': 'فلٹرز',
    'hotels.footer.tagline': 'ہمارے پریمیم بکنگ پلیٹ فارم کے ساتھ پاکستان بھر کے بہترین ہوٹلز دریافت اور بک کریں۔',
    'hotels.footer.copyright': '© 2024 پاک بکنگ بذریعہ ٹیراسولز۔ تمام حقوق محفوظ ہیں۔'
  },
  roman: {
    // Navigation
    'nav.home': 'Ghar',
    'nav.hotels': 'Hotels',
    'nav.about': 'Hamare Baare Mein',
    'nav.contact': 'Rabta',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin Panel',
    'nav.signin': 'Sign In',
    'nav.getstarted': 'Shuru Karein',
    'nav.logout': 'Logout',
    
    // Common
    'common.search': 'Talash',
    'common.book': 'Book Karein',
    'common.confirm': 'Booking Confirm Karein',
    'common.cancel': 'Cancel',
    'common.back': 'Ghar Wapas',
    'common.loading': 'Load Ho Raha Hai...',
    
    // Booking
    'booking.congratulations': '🎉 Mubarak Ho! Aap Ki Booking Confirm Ho Gayi!',
    'booking.success': 'Booking Ki Details Ke Liye Dashboard Check Karein!',
    'booking.pending': 'Intezar Mein',
    'booking.confirmed': 'Confirm Shuda',
    'booking.cancelled': 'Cancel Shuda',
    
    // Dashboard
    'dashboard.welcome': 'Khush Aamdeed',
    'dashboard.manage': 'Apni Bookings Aur Account Settings Ka Intezam Karein',
    
    // About Page
    'about.title': 'PakBooking Ke Baare Mein',
    'about.subtitle': 'Pakistan Ka Behtareen Hotel Booking Platform, Jo Modern Technology Ke Saath Musafiron Ke Liye Mulk Bhar Mein Rehaish Talash Karne Aur Book Karne Ke Tareeqe Mein Inqilab La Raha Hai.',
    'about.story.title': 'Hamari Kahani',
    'about.story.desc1': 'PakBooking Pakistan Mein Hotel Booking Ke Tajurbe Ko Tabdeel Karne Ke Vision Ke Saath Banaya Gaya Tha. Hum Modern Technology Ko Pakistani Mehmaan Nawazi Ki Gahri Samajh Ke Saath Mila Kar Musafiron Ke Liye Ek Behtareen Booking Platform Banate Hain.',
    'about.story.desc2': 'Hamara Platform Musafiron Ko Pakistan Bhar Ki Behtareen Rehaish Se Jodta Hai, Bade Shahron Ke Luxury Hotels Se Le Kar Khubsurat Maqamat Ke Boutique Resorts Tak. Hum Har Musafir Ke Liye Hotel Booking Ko Aasan, Mehfooz Aur Khushgawar Banane Ke Liye Parezm Hain.',
    'about.mission.title': 'Hamara Mission',
    'about.mission.desc': 'Musafiron Ko Pakistan Mein Sab Se Jame Aur User Friendly Hotel Booking Platform Faraham Karna, Talash Se Qiyam Tak Behtareen Tajurbat Ko Yaqeeni Banana.',
    'about.vision.title': 'Hamara Vision',
    'about.vision.desc': 'Pakistan Ka Sab Se Qabil Aitmaad Hotel Booking Platform Banna, Lakhon Musafiron Ko Mulk Bhar Ki Behtareen Rehaish Se Jodna.',
    'about.stats.experience': 'Saal Tajurba',
    'about.stats.clients': 'Khush Clients',
    'about.stats.projects': 'Mukammal Projects',
    'about.stats.support': 'Support',
    'about.services.title': 'Hamari Khidmat',
    'about.services.subtitle': 'Aap Ki Business Zarooriaat Ke Mutabiq Jame Technology Solutions',
    'about.services.booking.title': 'Hotel Booking',
    'about.services.booking.desc': 'Pakistan Bhar Mein Aasan Aur Mehfooz Hotel Reservation',
    'about.services.confirmation.title': 'Fori Tasdeeq',
    'about.services.confirmation.desc': 'Real Time Booking Confirmation Aur Fori Receipts',
    'about.services.payments.title': 'Mehfooz Payment',
    'about.services.payments.desc': '100% Mehfooz Payment Processing Aur Data Protection',
    'about.why.title': 'PakBooking Kyun Muntakhib Karein?',
    'about.why.expert.title': 'Mahir Team',
    'about.why.expert.desc': 'Tajurbakar Developers Aur Designers',
    'about.why.standards.title': 'Aalmi Mayaar',
    'about.why.standards.desc': 'International Quality Aur Behtareen Tareeqe',
    'about.why.support.title': '24/7 Support',
    'about.why.support.desc': 'Aap Ki Zarooriaat Ke Liye Hamesha Dastiyab',
    
    // Contact Page
    'contact.title': 'PakBooking Se Rabta',
    'contact.subtitle': 'Hotel Booking Ke Baare Mein Sawal Hain Ya Madad Chahiye? Hum Yahan Madad Ke Liye Hain! Zati Support Aur Safri Tajaweez Ke Liye Hamari Team Se Rabta Karein.',
    'contact.form.title': 'Hamein Paigham Bhejein',
    'contact.form.subtitle': 'Neeche Diya Gaya Form Bharein Aur Hum Jald Az Jald Aap Se Rabta Karenge.',
    'contact.form.name': 'Mukammal Naam',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.subject': 'Mauzoo',
    'contact.form.message': 'Aap Ka Paigham',
    'contact.form.send': 'Paigham Bhejein',
    'contact.form.success': 'Aap Ke Paigham Ka Shukriya! Hum Jald Aap Se Rabta Karenge.',
    'contact.info.phone': 'Phone',
    'contact.info.email': 'Email',
    'contact.info.whatsapp': 'WhatsApp',
    'contact.info.hours': 'Business Hours',
    'contact.info.hours.value': '24/7 Dastiyab',
    'contact.info.hours.desc': 'Jab Bhi Aap Ko Zaroorat Ho Hum Yahan Hain',
    'contact.info.phone.desc': 'Fori Madad Ke Liye Hamein Call Karein',
    'contact.info.email.desc': 'Kisi Bhi Waqt Apne Sawalat Bhejein',
    'contact.info.whatsapp.desc': 'Hamare Saath Chat Karein',
    'contact.info.whatsapp.text': 'Fori Madad Ke Liye Brahe Rast WhatsApp Support',
    'contact.why.title': 'PakBooking Kyun Muntakhib Karein?',
    'contact.why.expert.title': 'Mahir Team',
    'contact.why.expert.desc': 'Tajurbakar Developers Aur Designers',
    'contact.why.standards.title': 'Aalmi Mayaar',
    'contact.why.standards.desc': 'International Quality Aur Behtareen Tareeqe',
    'contact.why.support.title': '24/7 Support',
    'contact.why.support.desc': 'Aap Ki Zarooriaat Ke Liye Hamesha Dastiyab',
    'contact.quick.title': 'Fori Rabta',
    
    // Homepage
    'home.hero.title': 'Pakistan Ke Behtareen Hotels Daryaft Karein',
    'home.hero.subtitle': 'PakBooking Ke Saath Apna Behtareen Qiyam Book Karein - Luxury Resorts Se Le Kar Pakistan Bhar Ke Aram Deh Guest Houses Tak',
    'home.cards.luxury.title': 'Luxury Farar',
    'home.cards.luxury.desc': 'Yaadgar Tajurbat Ke Liye Premium Hotels Aur Resorts',
    'home.cards.family.title': 'Khandani Chuttiyan',
    'home.cards.family.desc': 'Yaadgar Khandani Chuttiyon Ke Liye Behtareen Rehaish',
    'home.cards.adventure.title': 'Adventure Qiyam',
    'home.cards.adventure.desc': 'Sensani Khaiz Aur Fitrat Ke Mohbon Ke Liye Munfarid Maqamat',
    'home.cta.search': 'Tamam Hotels Talash Karein',
    'home.cta.explore': 'Daryaft Karein',
    
    // Homepage Additional Sections
    'home.slides.unforgettable.title': 'Yaadgar Tajurbat',
    'home.slides.unforgettable.subtitle': 'Pahadon Se Shahron Tak, Apna Behtareen Qiyam Talash Karein',
    'home.slides.confidence.title': 'Aitmaad Ke Saath Book Karein',
    'home.slides.confidence.subtitle': 'Mehfooz Payment Aur Fori Tasdeeq',
    'home.stats.hotels': 'Premium Hotels',
    'home.stats.guests': 'Khush Mehmaan',
    'home.stats.cities': 'Shahar',
    'home.stats.satisfaction': 'Itminaan',
    'home.featured.title': 'Khusoosi Hotels',
    'home.featured.subtitle': 'Pakistan Bhar Mein Hamare Muntakhib Karda Premium Rehaish Ki Daryaft Karein',
    'home.featured.viewall': 'Tamam Hotels Dekhein',
    'home.why.title': 'PakBooking Kyun Muntakhib Karein?',
    'home.why.subtitle': 'Premium Features Ke Saath Pakistan Ka Behtareen Hotel Booking Platform Ka Tajurba Karein',
    'home.why.secure.title': 'Mehfooz Booking',
    'home.why.secure.desc': 'Fori Tasdeeq Ke Saath 100% Mehfooz Payment',
    'home.why.instant.title': 'Fori Tasdeeq',
    'home.why.instant.desc': 'Seconds Mein Booking Ki Tasdeeq Hasil Karein',
    'home.why.prices.title': 'Behtareen Qeemat',
    'home.why.prices.desc': 'Khusoosi Deals Ke Saath Kam Se Kam Qeemat Ki Zamaanat',
    'home.search.title': 'Apna Behtareen Hotel Talash Karein',
    'home.search.destination': 'Manzil',
    'home.search.destination.placeholder': 'Kahan Jana Hai?',
    'home.search.checkin': 'Check In',
    'home.search.checkout': 'Check Out',
    'home.search.guests': 'Mehmaan',
    'home.search.button': 'Hotels Talash Karein',
    'home.available.title': 'Dastiyab Hotels',
    'home.available.filters': 'Filters',
    'home.footer.tagline': 'Pakistan Ka Behtareen Hotel Booking Platform. Luxury Rehaish Daryaft Karein Aur Mulk Bhar Mein Yaadgar Yaadein Banayein.',
    'home.footer.links.about': 'Hamare Baare Mein',
    'home.footer.links.hotels': 'Hotels',
    'home.footer.links.contact': 'Rabta',
    'home.footer.links.privacy': 'Privacy',
    'home.footer.links.terms': 'Terms',
    'home.footer.copyright': '© 2024 PakBooking. Tamam Huqooq Mehfooz Hain. Pakistan Mein ❤️ Ke Saath Banaya Gaya.',
    
    // Hotels Page
    'hotels.search.title': 'Apna Behtareen Hotel Talash Karein',
    'hotels.search.destination': 'Manzil',
    'hotels.search.destination.placeholder': 'Kahan Jana Hai?',
    'hotels.search.checkin': 'Check In',
    'hotels.search.checkout': 'Check Out',
    'hotels.search.guests': 'Mehmaan',
    'hotels.search.button': 'Hotels Talash Karein',
    'hotels.available.title': 'Dastiyab Hotels',
    'hotels.available.filters': 'Filters',
    'hotels.footer.tagline': 'Hamare Premium Booking Platform Ke Saath Pakistan Bhar Ke Behtareen Hotels Daryaft Aur Book Karein.',
    'hotels.footer.copyright': '© 2024 PakBooking By Terasols. Tamam Huqooq Mehfooz Hain.'
  }
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguageState] = useState<'en' | 'ur' | 'roman'>('en');

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ur' | 'roman' || 'en';
    
    setTheme(savedTheme);
    setLanguageState(savedLanguage);
    
    // Apply theme to document
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  const setLanguage = (lang: 'en' | 'ur' | 'roman') => {
    console.log('Setting language to:', lang);
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key] || translations['en']?.[key] || key;
    console.log(`Translation for ${key} in ${language}:`, translation);
    console.log('Available translations for language:', Object.keys(translations[language] || {}));
    return translation;
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      language,
      toggleTheme,
      setLanguage,
      t
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
