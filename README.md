# 🏨 PakBooking - Complete Hotel Booking Management System

[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)](https://www.docker.com/)
[![Django](https://img.shields.io/badge/Django-4.2+-green?logo=django)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)

A comprehensive, production-ready hotel booking platform designed specifically for Pakistan's hospitality industry. Built with modern technologies and featuring a complete booking management system with admin controls, real-time notifications, and detailed financial tracking.

## 🎯 Key Features

### 👤 User Features
- **🔐 Secure Authentication**: JWT-based login/registration system
- **🏨 Property Discovery**: Browse hotels across Pakistan with 4K images
- **🔍 Advanced Search**: Filter by city, dates, price, and guest count
- **📅 Complete Booking Flow**: Availability checking, pricing, and confirmation
- **💰 Flexible Payment**: Multiple payment options (Stripe/Razorpay ready)
- **📱 Responsive PWA**: Mobile-first design with offline support
- **🌙 Theme System**: Dark/Light mode with smooth transitions
- **🌐 Multi-language**: English, Urdu, and Roman Urdu support
- **📊 Personal Dashboard**: Booking management with status tracking
- **⭐ Favorites**: Save preferred hotels for quick access
- **🔔 Real-time Notifications**: Instant booking updates
- **📄 Detailed Receipts**: Complete booking information with pricing

### 👨‍💼 Admin Features
- **📋 Booking Management**: Full control with bulk actions
- **👥 User Management**: Complete user account administration
- **🏨 Property Management**: Add, edit, and manage hotel listings
- **📊 Analytics Dashboard**: Booking statistics and financial tracking
- **🔔 Notification System**: Automated notifications for all events
- **💰 Financial Controls**: Refund processing with configurable rates
- **📈 Status Management**: Confirm, complete, or cancel bookings
- **🔍 Advanced Search**: Filter and search across all data

### 🛠️ Technical Features
- **🐳 Docker Containerization**: Complete containerized deployment
- **📊 PostgreSQL Database**: Robust, scalable database solution
- **🔄 Real-time Updates**: Live booking status and notifications
- **📱 Progressive Web App**: Fast, app-like experience
- **🔒 Enterprise Security**: JWT auth, CORS, input validation
- **📈 Performance Optimized**: Lazy loading, image optimization
- **🧪 Comprehensive Testing**: Unit, integration, and E2E tests
- **📚 Complete API Docs**: Swagger/OpenAPI documentation

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
git clone https://github.com/yourusername/pakbooking.git
cd pakbooking
```

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/docs/

### Default Admin Access
- **URL**: http://localhost:8000/admin
- **Email**: `admin@bookpakistan.com`
- **Password**: (set during first setup)

## 📊 Booking Status Flow

```
📋 PENDING → ✅ CONFIRMED → 🎉 COMPLETED
    ↓           ↓              ↓
❌ CANCELLED ← ❌ CANCELLED ← ❌ CANCELLED
    ↓
💰 REFUNDED
```

### Status Descriptions
- **⏳ PENDING**: New booking awaiting confirmation
- **✅ CONFIRMED**: Booking confirmed by user or admin
- **🎉 COMPLETED**: Stay completed successfully
- **❌ CANCELLED**: Booking cancelled (user: 2% fee, admin: full refund)
- **💰 REFUNDED**: Refund processed and completed

## 💰 Refund Policy

### User Cancellation
- **Deduction**: 2% of total booking amount
- **Processing Time**: 3-5 business days
- **Example**: PKR 50,000 → PKR 1,000 fee → PKR 49,000 refund

### Admin Cancellation
- **Deduction**: 0% (Full refund)
- **Processing Time**: 1-2 business days
- **Use Case**: Property unavailable, system error, special circumstances

## 🏗️ Project Structure

```
pakbooking/
├── 📁 backend/                    # Django REST API
│   ├── 📁 config/                # Django settings and configuration
│   ├── 📁 users/                 # User authentication and management
│   ├── 📁 listings/              # Property/hotel management
│   ├── 📁 bookings/              # Booking system with status management
│   ├── 📁 notifications/         # Real-time notification system
│   ├── 📄 Dockerfile             # Backend containerization
│   ├── 📄 requirements.txt       # Python dependencies
│   └── 📄 entrypoint.sh          # Container startup script
├── 📁 frontend/                   # Next.js application
│   ├── 📁 src/
│   │   ├── 📁 app/               # Next.js app router pages
│   │   ├── 📁 components/        # Reusable UI components
│   │   ├── 📁 contexts/          # React context providers
│   │   └── 📁 lib/               # API client and utilities
│   ├── 📁 public/                # Static assets and images
│   ├── 📄 Dockerfile             # Frontend containerization
│   └── 📄 package.json           # Node.js dependencies
├── 📄 docker-compose.yml         # Docker orchestration
├── 📄 README.md                  # This file
└── 📄 PROJECT_DESCRIPTION.md     # Detailed project documentation
```

## 🛠️ Tech Stack

### Backend
- **🐍 Python 3.11+**: Core programming language
- **🌐 Django 4.2+**: Web framework
- **🔌 Django REST Framework**: API framework
- **🐘 PostgreSQL 14+**: Primary database
- **🔐 JWT Authentication**: Secure token-based auth
- **🐳 Docker**: Containerization
- **📊 Celery**: Background task processing (optional)

### Frontend
- **⚛️ React 18**: UI library
- **🚀 Next.js 14**: React framework with App Router
- **📘 TypeScript 5.0+**: Type-safe JavaScript
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **🎭 Framer Motion**: Animation library
- **📱 PWA**: Progressive Web App capabilities
- **🌐 React Query**: Data fetching and caching

### DevOps & Tools
- **🐳 Docker & Docker Compose**: Containerization
- **📊 Nginx**: Reverse proxy and load balancer
- **🔍 ESLint & Prettier**: Code quality and formatting
- **🧪 Jest & Cypress**: Testing frameworks
- **📚 Swagger/OpenAPI**: API documentation

## 🔔 Notification System

### Automated Notifications
1. **📧 Booking Created**: "Your booking is pending confirmation"
2. **✅ Booking Confirmed**: "Congratulations! Your booking is confirmed with receipt"
3. **🎉 Stay Completed**: "Thank you for staying! Please leave a review"
4. **❌ Booking Cancelled**: "Booking cancelled with refund details"
5. **💰 Refund Processed**: "Refund processed successfully"

### Notification Features
- **Real-time Updates**: Instant notifications on status changes
- **Detailed Information**: Booking ID, amounts, dates included
- **Actionable Content**: Direct links to receipts and reviews
- **Unread Tracking**: Badge counts for unread notifications

## 🔍 Search & Discovery

### Advanced Filters
- **📍 Location**: City-based filtering
- **📅 Dates**: Check-in/check-out availability
- **👥 Guests**: Guest count filtering
- **💰 Price Range**: Budget-based filtering
- **⭐ Rating**: Quality-based filtering
- **🏷️ Amenities**: Feature-based filtering

### Search Features
- **🔍 Real-time Search**: Instant results as you type
- **📍 Map Integration**: Visual property discovery
- **💾 Saved Searches**: Remember favorite search criteria
- **📊 Availability Calendar**: Visual availability display

## 📚 API Documentation

### RESTful API Endpoints

#### Authentication
```
POST /api/auth/register/          # User registration
POST /api/auth/login/             # User login
POST /api/auth/logout/            # User logout
POST /api/auth/refresh/           # Refresh JWT token
```

#### Properties
```
GET  /api/properties/             # List all properties
GET  /api/properties/{id}/        # Get property details
POST /api/properties/             # Create property (admin)
PUT  /api/properties/{id}/        # Update property (admin)
DELETE /api/properties/{id}/      # Delete property (admin)
```

#### Bookings
```
GET  /api/bookings/               # Get user bookings
POST /api/bookings/               # Create new booking
GET  /api/bookings/{id}/          # Get booking details
POST /api/bookings/{id}/user_confirm/    # User confirm booking
POST /api/bookings/{id}/user_complete/   # User complete booking
POST /api/bookings/{id}/cancel/          # User cancel booking (2% fee)
GET  /api/bookings/{id}/receipt/         # Get detailed receipt
```

#### Admin Booking Controls
```
POST /api/bookings/{id}/confirm/         # Admin confirm booking
POST /api/bookings/{id}/complete/        # Admin complete booking
POST /api/bookings/{id}/admin_cancel/    # Admin cancel (full refund)
```

#### Notifications
```
GET  /api/notifications/notifications/           # Get all notifications
GET  /api/notifications/notifications/unread_count/ # Unread count
POST /api/notifications/notifications/{id}/mark_read/ # Mark as read
```

### API Documentation Access
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Postman Collection**: Available in `/docs` folder

## 🧪 Development

### Local Development Setup

#### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
```bash
# Create PostgreSQL database
createdb pakbooking

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data
python manage.py loaddata sample_data.json
```

### Testing

#### Backend Tests
```bash
cd backend
python manage.py test
python manage.py test --coverage
```

#### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

#### E2E Tests
```bash
cd frontend
npm run test:e2e
```

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

1. **Environment Variables**: Set production environment variables
2. **SSL Certificate**: Configure HTTPS
3. **Database**: Set up PostgreSQL with proper backup
4. **Static Files**: Configure static file serving
5. **Domain**: Point domain to server
6. **Monitoring**: Set up application monitoring

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pakbooking

# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# JWT
JWT_SECRET_KEY=your-jwt-secret

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 📊 Performance & Monitoring

### Performance Metrics
- **⚡ Lighthouse Score**: >90 (Performance, Accessibility, SEO)
- **📱 Mobile Performance**: Optimized for mobile devices
- **🔄 Load Time**: <2 seconds initial load
- **📊 Database**: Optimized queries with proper indexing

### Monitoring
- **📈 Application Performance**: Built-in performance monitoring
- **🔍 Error Tracking**: Comprehensive error logging
- **📊 Usage Analytics**: User behavior tracking
- **💾 Database Monitoring**: Query performance tracking

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **📝 TypeScript**: Strict type checking enabled
- **🎨 ESLint**: Code quality enforcement
- **📐 Prettier**: Consistent code formatting
- **🧪 Testing**: Required for all new features
- **📚 Documentation**: Update docs for new features

### Pull Request Guidelines

- **✅ Tests**: All tests must pass
- **📚 Documentation**: Update relevant documentation
- **🎨 Code Style**: Follow project coding standards
- **🔍 Review**: All PRs require code review
- **📝 Description**: Clear description of changes

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Django Community**: For the excellent web framework
- **Next.js Team**: For the amazing React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Pakistan Tourism**: For inspiration and local market insights
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

- **📧 Email**: support@pakbooking.com
- **🐛 Issues**: [GitHub Issues](https://github.com/yourusername/pakbooking/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/yourusername/pakbooking/discussions)
- **📚 Documentation**: [Project Wiki](https://github.com/yourusername/pakbooking/wiki)

---

**Built with ❤️ for Pakistan's hospitality industry**

**🌟 Star this repository if you found it helpful!**