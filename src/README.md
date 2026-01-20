# Hospital Appointment System

A full-stack web application for managing hospital appointments built with React, Express, Node.js, and MongoDB.

## 🚀 **Live Application**

**Frontend:** https://hospital-frontend-lilac-eight.vercel.app/  
**Backend API:** https://hospital-backend-9h3a.onrender.com/api

Try it now! Register as a Patient or Doctor and book appointments.

## Features

- **User Authentication & Authorization**
  - Patient and Doctor registration
  - Secure login with JWT authentication
  - Role-based access control

- **User Management**
  - Register as Patient or Doctor
  - View all available Doctors/Patients
  - Update user profile information

- **Appointment Management**
  - Book appointments with doctors
  - View all booked appointments
  - Cancel appointments
  - Check appointment status (pending, confirmed, completed, cancelled)
  - Doctor availability tracking

## Project Structure

```
hospital_managment_app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── appointmentController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── appointmentRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── BookAppointment.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   ├── BookAppointment.css
    │   │   └── index.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── App.css
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .gitignore
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## Installation

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```env
MONGO_URI=mongodb://localhost:27017/hospital_appointment
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/patients` - Get all patients
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/:userId` - Get user by ID
- `PUT /api/users/:userId` - Update user profile

### Appointments

- `POST /api/appointments/book` - Book a new appointment (Patient only)
- `GET /api/appointments` - Get appointments (with filters)
- `GET /api/appointments/:appointmentId` - Get appointment by ID
- `PUT /api/appointments/:appointmentId` - Update appointment
- `PUT /api/appointments/:appointmentId/cancel` - Cancel appointment
- `DELETE /api/appointments/:appointmentId` - Delete appointment

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## User Roles

### Patient

- Can register and view their profile
- Can view all available doctors
- Can book appointments with doctors
- Can view their own appointments
- Can cancel their appointments

### Doctor

- Can register and view their profile
- Can view all patients
- Can view their appointments
- Can manage appointment status

## Database Models

### User Schema

```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  role: String ('patient' | 'doctor'),
  fullName: String (required),
  phone: String (required),
  specialization: String (for doctors),
  bio: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Schema

```javascript
{
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: User),
  appointmentDate: Date,
  appointmentTime: String,
  reason: String,
  status: String ('pending' | 'confirmed' | 'completed' | 'cancelled'),
  notes: String,
  cancelledAt: Date,
  cancelledBy: String ('patient' | 'doctor'),
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Available Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Features

- Password hashing with bcryptjs
- JWT authentication
- Input validation with validator library
- MongoDB injection protection
- Role-based access control
- CORS enabled

## Technologies Used

### Backend

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **validator** - Input validation

### Frontend

- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool
- **Date-fns** - Date utility library

## Usage Examples

### Register as Patient

```bash
POST /api/auth/register
{
  "username": "john_patient",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "patient"
}
```

### Register as Doctor

```bash
POST /api/auth/register
{
  "username": "dr_smith",
  "email": "smith@example.com",
  "password": "password123",
  "fullName": "Dr. Smith",
  "phone": "+0987654321",
  "role": "doctor",
  "specialization": "Cardiology"
}
```

### Login

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Book Appointment

```bash
POST /api/appointments/book
Authorization: Bearer <token>
{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "14:00",
  "reason": "Regular checkup for my medical condition"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Future Enhancements

- Email notifications for appointments
- SMS reminders
- Payment integration
- Appointment rescheduling
- Doctor ratings and reviews
- Prescription management
- Medical records storage
- Video consultation support
- Admin panel
- Analytics and reporting

## License

MIT License

## Support

For support, please contact the development team or open an issue in the repository.
