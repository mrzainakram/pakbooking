# 📚 PakBooking API Documentation

## 🔗 Base URL
```
Development: http://localhost:8000/api/
Production: https://api.pakbooking.com/api/
```

## 🔐 Authentication

### JWT Token System
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-access-token>
```

### Token Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+923001234567"
}
```

**Response:**
```json
{
  "detail": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

#### Login User
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_staff": false
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Logout User
```http
POST /api/auth/logout/
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## 🏨 Properties API

### List All Properties
```http
GET /api/properties/
```

**Query Parameters:**
- `city` (string): Filter by city name
- `property_type` (string): Filter by property type (hotel, guest_house, resort, apartment)
- `min_price` (number): Minimum price per night
- `max_price` (number): Maximum price per night
- `max_guests` (number): Minimum guest capacity
- `amenities` (string): Comma-separated amenity names
- `search` (string): Search in title and description
- `page` (number): Page number for pagination
- `page_size` (number): Number of items per page

**Response:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/properties/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "title": "Luxury Hotel Karachi",
      "description": "5-star luxury hotel in heart of Karachi",
      "property_type": "hotel",
      "price_per_night": "25000.00",
      "max_guests": 4,
      "city": "Karachi",
      "address": "Main Boulevard, Karachi",
      "amenities": ["wifi", "pool", "gym", "restaurant"],
      "images": [
        {
          "id": "uuid",
          "image": "http://localhost:8000/media/properties/image1.jpg",
          "caption": "Hotel exterior"
        }
      ],
      "rating": 4.8,
      "reviews_count": 156,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Property Details
```http
GET /api/properties/{id}/
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Luxury Hotel Karachi",
  "description": "5-star luxury hotel in heart of Karachi",
  "property_type": "hotel",
  "price_per_night": "25000.00",
  "max_guests": 4,
  "city": "Karachi",
  "address": "Main Boulevard, Karachi",
  "amenities": ["wifi", "pool", "gym", "restaurant"],
  "images": [
    {
      "id": "uuid",
      "image": "http://localhost:8000/media/properties/image1.jpg",
      "caption": "Hotel exterior"
    }
  ],
  "rating": 4.8,
  "reviews_count": 156,
  "owner": {
    "id": "uuid",
    "email": "owner@hotel.com",
    "first_name": "Hotel",
    "last_name": "Owner"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Create Property (Admin Only)
```http
POST /api/properties/
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "New Hotel",
  "description": "Beautiful hotel description",
  "property_type": "hotel",
  "price_per_night": "15000.00",
  "max_guests": 2,
  "city": "Lahore",
  "address": "Mall Road, Lahore",
  "amenities": ["wifi", "parking"]
}
```

### Update Property (Admin/Owner Only)
```http
PUT /api/properties/{id}/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Hotel Name",
  "price_per_night": "18000.00"
}
```

### Delete Property (Admin/Owner Only)
```http
DELETE /api/properties/{id}/
Authorization: Bearer <token>
```

## 📋 Bookings API

### List User Bookings
```http
GET /api/bookings/
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string): Filter by status (pending, confirmed, completed, cancelled, refunded)
- `payment_status` (string): Filter by payment status
- `page` (number): Page number
- `page_size` (number): Items per page

**Response:**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/bookings/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "property": "uuid",
      "property_details": {
        "id": "uuid",
        "title": "Luxury Hotel Karachi",
        "city": "Karachi",
        "images": [...]
      },
      "check_in": "2024-12-25",
      "check_out": "2024-12-27",
      "guests": 2,
      "total_price": "50000.00",
      "contact_phone": "+923001234567",
      "contact_email": "user@example.com",
      "special_requests": "Late check-in please",
      "status": "confirmed",
      "payment_status": "paid",
      "payment_id": "pay_123456789",
      "refund_amount": null,
      "cancellation_fee": null,
      "nights": 2,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "confirmed": true
    }
  ]
}
```

### Create Booking
```http
POST /api/bookings/
Authorization: Bearer <token>
Content-Type: application/json

{
  "property": "property-uuid",
  "check_in": "2024-12-25",
  "check_out": "2024-12-27",
  "guests": 2,
  "contact_phone": "+923001234567",
  "contact_email": "user@example.com",
  "special_requests": "Late check-in please"
}
```

**Response:**
```json
{
  "id": "uuid",
  "property": "uuid",
  "check_in": "2024-12-25",
  "check_out": "2024-12-27",
  "guests": 2,
  "total_price": "50000.00",
  "contact_phone": "+923001234567",
  "contact_email": "user@example.com",
  "special_requests": "Late check-in please",
  "status": "pending",
  "payment_status": "pending",
  "nights": 2,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Get Booking Details
```http
GET /api/bookings/{id}/
Authorization: Bearer <token>
```

### User Booking Controls

#### User Confirm Booking
```http
POST /api/bookings/{id}/user_confirm/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "detail": "Booking confirmed successfully",
  "booking_id": "uuid",
  "status": "confirmed",
  "message": "Your booking has been confirmed! You will receive a detailed receipt."
}
```

#### User Complete Booking
```http
POST /api/bookings/{id}/user_complete/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "detail": "Booking marked as completed",
  "booking_id": "uuid",
  "status": "completed",
  "message": "Thank you for your stay! Please consider leaving a review."
}
```

#### User Cancel Booking (2% deduction)
```http
POST /api/bookings/{id}/cancel/
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Change of plans"
}
```

**Response:**
```json
{
  "detail": "Booking cancelled successfully",
  "original_amount": "50000.00",
  "deduction_amount": "1000.00",
  "refund_amount": "49000.00",
  "deduction_percentage": "2%",
  "status": "cancelled"
}
```

#### Get Detailed Receipt
```http
GET /api/bookings/{id}/receipt/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "receipt": {
    "booking_id": "uuid",
    "booking_status": "confirmed",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    
    "guest_info": {
      "name": "John Doe",
      "email": "user@example.com",
      "contact_phone": "+923001234567",
      "contact_email": "user@example.com"
    },
    
    "property_info": {
      "name": "Luxury Hotel Karachi",
      "address": "Main Boulevard, Karachi",
      "city": "Karachi",
      "type": "hotel"
    },
    
    "booking_details": {
      "check_in": "2024-12-25",
      "check_out": "2024-12-27",
      "nights": 2,
      "guests": 2,
      "special_requests": "Late check-in please"
    },
    
    "pricing": {
      "price_per_night": "25000.00",
      "nights": 2,
      "base_price": "50000.00",
      "tax_amount": "2500.00",
      "service_fee": "1000.00",
      "subtotal": "53500.00",
      "total_paid": "50000.00"
    },
    
    "payment_info": {
      "payment_status": "paid",
      "payment_id": "pay_123456789",
      "cancellation_fee": null,
      "refund_amount": null
    },
    
    "status_info": {
      "current_status": "confirmed",
      "confirmed": true,
      "can_cancel": true,
      "can_complete": false
    }
  },
  "message": "Receipt for booking #uuid"
}
```

### Admin Booking Controls (Staff Only)

#### Admin Confirm Booking
```http
POST /api/bookings/{id}/confirm/
Authorization: Bearer <admin-token>
```

#### Admin Complete Booking
```http
POST /api/bookings/{id}/complete/
Authorization: Bearer <admin-token>
```

#### Admin Cancel Booking (Full Refund)
```http
POST /api/bookings/{id}/admin_cancel/
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "detail": "Booking cancelled by admin",
  "booking_id": "uuid",
  "status": "cancelled",
  "refund_amount": "50000.00"
}
```

### Check Availability
```http
GET /api/bookings/availability/
```

**Query Parameters:**
- `property` (string): Property UUID
- `check_in` (date): Check-in date (YYYY-MM-DD)
- `check_out` (date): Check-out date (YYYY-MM-DD)

**Response:**
```json
{
  "available": true,
  "property_id": "uuid",
  "check_in": "2024-12-25",
  "check_out": "2024-12-27",
  "conflicting_bookings": []
}
```

### Calculate Price
```http
POST /api/bookings/calculate_price/
Content-Type: application/json

{
  "property_id": "uuid",
  "check_in": "2024-12-25",
  "check_out": "2024-12-27",
  "guests": 2
}
```

**Response:**
```json
{
  "property_id": "uuid",
  "check_in": "2024-12-25",
  "check_out": "2024-12-27",
  "guests": 2,
  "nights": 2,
  "price_per_night": "25000.00",
  "base_price": "50000.00",
  "tax_amount": "2500.00",
  "service_fee": "1000.00",
  "total_price": "53500.00"
}
```

## 🔔 Notifications API

### List All Notifications
```http
GET /api/notifications/notifications/
Authorization: Bearer <token>
```

**Query Parameters:**
- `unread_only` (boolean): Show only unread notifications
- `notification_type` (string): Filter by type
- `page` (number): Page number
- `page_size` (number): Items per page

**Response:**
```json
{
  "count": 15,
  "next": "http://localhost:8000/api/notifications/notifications/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user": "uuid",
      "booking": "uuid",
      "notification_type": "booking_confirmed",
      "title": "✅ Booking Confirmed!",
      "message": "🎉 Congratulations! Your booking for Luxury Hotel Karachi has been confirmed.\n\n📋 Booking Details:\n• Booking ID: #uuid\n• Check-in: 2024-12-25\n• Check-out: 2024-12-27\n• Guests: 2\n• Total: PKR 50000\n\n📄 Your detailed receipt is ready! View it in your dashboard.",
      "read": false,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Unread Count
```http
GET /api/notifications/notifications/unread_count/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "unread_count": 5
}
```

### Mark Notification as Read
```http
POST /api/notifications/notifications/{id}/mark_read/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "detail": "Notification marked as read"
}
```

## 👥 Users API

### Get User Profile
```http
GET /api/users/profile/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+923001234567",
  "date_joined": "2024-01-15T10:30:00Z",
  "is_staff": false,
  "is_active": true
}
```

### Update User Profile
```http
PUT /api/users/profile/
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+923009876543"
}
```

### List All Users (Admin Only)
```http
GET /api/users/users/
Authorization: Bearer <admin-token>
```

## ❌ Error Responses

### 400 Bad Request
```json
{
  "field_name": ["This field is required."],
  "non_field_errors": ["Check-out date must be after check-in date"]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "A server error occurred."
}
```

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 405 | Method Not Allowed - HTTP method not supported |
| 500 | Internal Server Error - Server error |

## 🔧 Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per user
- **Admin endpoints**: 200 requests per minute per admin user

## 📝 Pagination

All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

Response includes:
- `count`: Total number of items
- `next`: URL for next page (null if last page)
- `previous`: URL for previous page (null if first page)
- `results`: Array of items for current page

## 🔍 Filtering & Search

Most list endpoints support filtering and search:

### Common Filters
- `search`: Text search across relevant fields
- `ordering`: Sort by field (prefix with `-` for descending)
- `page`: Page number
- `page_size`: Items per page

### Example Usage
```http
GET /api/properties/?city=Karachi&min_price=10000&max_price=50000&search=luxury&ordering=-rating&page=1&page_size=10
```

## 📱 Mobile App Integration

The API is designed to work seamlessly with mobile applications:

- **JWT tokens** for secure authentication
- **RESTful design** for easy integration
- **JSON responses** for all endpoints
- **Comprehensive error handling**
- **Pagination support** for large datasets
- **Real-time notifications** via polling

## 🧪 Testing

### Postman Collection
A complete Postman collection is available in the `/docs` folder with:
- All API endpoints
- Sample requests and responses
- Environment variables setup
- Authentication flow examples

### API Testing
```bash
# Install dependencies
pip install -r requirements.txt

# Run API tests
python manage.py test

# Run with coverage
python manage.py test --coverage
```

## 📚 Additional Resources

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Django Admin**: http://localhost:8000/admin/
- **GitHub Repository**: [Repository URL]
- **Project Documentation**: [Documentation URL]

---

**For support and questions, please contact:**
- **📧 Email**: mrzainakram01@gmail.com
- **📱 Phone**: +92 304 6164257
- **🔗 LinkedIn**: [linkedin.com/in/mrzainakram](https://www.linkedin.com/in/mrzainakram)
- **🐛 GitHub Issues**: [GitHub Issues](https://github.com/mrzainakram/pakbooking/issues)
- **📚 Documentation**: [API Documentation](https://github.com/mrzainakram/pakbooking/wiki)
