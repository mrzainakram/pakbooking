# 🏨 PakBooking - Complete Hotel Booking Management System

**A comprehensive, production-ready hotel booking platform designed specifically for Pakistan's hospitality industry.**

## 🌟 Overview

PakBooking is a full-stack hotel booking platform built with modern technologies, featuring a complete booking management system with admin controls, real-time notifications, and detailed financial tracking.

## ✨ Key Features

### 👤 User Features
- 🔐 **Secure Authentication** - JWT-based login/registration
- 🏨 **Property Discovery** - Browse hotels across Pakistan with 4K images
- 🔍 **Advanced Search** - Filter by city, dates, price, and guest count
- 📅 **Complete Booking Flow** - Availability checking, pricing, and confirmation
- 💰 **Payment Ready** - Stripe/Razorpay integration prepared
- 📱 **Responsive PWA** - Mobile-first design with offline support
- 🌙 **Theme System** - Dark/Light mode with smooth transitions
- 🌐 **Multi-language** - English, Urdu, and Roman Urdu support
- 📊 **Personal Dashboard** - Booking management with status tracking
- ⭐ **Favorites** - Save preferred hotels for quick access
- 🔔 **Real-time Notifications** - Instant booking updates
- 📄 **Detailed Receipts** - Complete booking information with pricing

### 👨‍💼 Admin Features
- 📋 **Booking Management** - Full control with bulk actions
- 👥 **User Management** - Complete user account administration
- 🏨 **Property Management** - Add, edit, and manage hotel listings
- 📊 **Analytics Dashboard** - Booking statistics and financial tracking
- 🔔 **Notification System** - Automated notifications for all events
- 💰 **Financial Controls** - Refund processing with configurable rates
- 📈 **Status Management** - Confirm, complete, or cancel bookings
- 🔍 **Advanced Search** - Filter and search across all data

## 🛠️ Tech Stack

### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL 16** - Primary database
- **JWT Authentication** - Secure token-based auth
- **Docker** - Containerization

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5.0+** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **PWA** - Progressive Web App capabilities

### DevOps
- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Database with health checks
- **Nginx** - Reverse proxy and load balancer
- **Swagger/OpenAPI** - API documentation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/pakbooking.git
cd pakbooking

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:8000
# Admin Panel: http://localhost:8000/admin
# API Documentation: http://localhost:8000/api/docs/
```

## 📊 Booking Status System

```
📋 PENDING → ✅ CONFIRMED → 🎉 COMPLETED
    ↓           ↓              ↓
❌ CANCELLED ← ❌ CANCELLED ← ❌ CANCELLED
    ↓
💰 REFUNDED
```

### User Controls
- **Confirm Booking** - User confirms their own booking
- **Complete Stay** - Mark booking as completed after stay
- **Cancel Booking** - Cancel with 2% deduction (98% refund)
- **Get Receipt** - Detailed booking information

### Admin Controls
- **Confirm Bookings** - Admin confirms any booking
- **Complete Bookings** - Admin marks bookings as completed
- **Cancel Bookings** - Admin cancels with full refund
- **Bulk Operations** - Manage multiple bookings at once

## 💰 Refund Policy

- **User Cancellation**: 2% deduction (98% refund)
- **Admin Cancellation**: Full refund (100%)
- **Processing Time**: 3-5 business days

## 🔔 Smart Notifications

- **Booking Created**: "Your booking is pending confirmation"
- **Booking Confirmed**: "Congratulations! Your booking is confirmed with receipt"
- **Stay Completed**: "Thank you for staying! Please leave a review"
- **Booking Cancelled**: "Booking cancelled with refund details"
- **Refund Processed**: "Refund processed successfully"

## 📚 Documentation

- **[README](README.md)** - Complete setup and usage guide
- **[Project Description](PROJECT_DESCRIPTION.md)** - Detailed feature overview
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Summary](DEPLOYMENT_SUMMARY.md)** - Production deployment guide

## 🎯 Features Highlights

### ✅ Production Ready
- Complete Docker setup
- Health checks and monitoring
- Error handling and logging
- Security best practices
- Performance optimization

### ✅ Admin Panel
- Django admin with custom actions
- Bulk operations for efficiency
- Financial tracking and analytics
- User and property management
- Real-time notifications

### ✅ Booking Management
- Complete booking lifecycle
- Status tracking and updates
- Automatic refund calculations
- Detailed receipt generation
- Real-time notifications

### ✅ User Experience
- Mobile-first responsive design
- Dark/Light theme support
- Multi-language support
- Progressive Web App
- Fast and intuitive interface

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Django)      │◄──►│   (PostgreSQL)  │
│   Port: 3001    │    │   Port: 8000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Current System Status

- **📈 Total Bookings**: 22
- **📨 Notifications**: 27
- **👥 Users**: 12
- **🏨 Properties**: 17
- **✅ All Services**: Healthy and Running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Django Community for the excellent web framework
- Next.js Team for the amazing React framework
- Tailwind CSS for the utility-first CSS framework
- Pakistan Tourism for inspiration and local market insights

## 📞 Support

- **📧 Email**: mrzainakram01@gmail.com
- **📱 Phone**: +92 304 6164257
- **🔗 LinkedIn**: [linkedin.com/in/mrzainakram](https://www.linkedin.com/in/mrzainakram)
- **🐛 Issues**: [GitHub Issues](https://github.com/mrzainakram/pakbooking/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/mrzainakram/pakbooking/discussions)
- **📚 Documentation**: [Project Wiki](https://github.com/mrzainakram/pakbooking/wiki)

---

**Built with ❤️ for Pakistan's hospitality industry**

**🌟 Star this repository if you found it helpful!**

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Documentation**: [Project Wiki]
- **Issues**: [GitHub Issues]
- **Discussions**: [GitHub Discussions]

## 🏆 Awards & Recognition

- ✅ **Production Ready** - Complete deployment setup
- ✅ **Fully Documented** - Comprehensive documentation
- ✅ **Test Ready** - Testing framework included
- ✅ **Scalable Architecture** - Built for growth
- ✅ **Security Focused** - Enterprise-grade security
