# Mt. Olives SDA Church Website

A modern, full-stack church website built with React, TypeScript, Node.js, and MySQL. This application provides a comprehensive platform for church management, member engagement, and community outreach.

## 🏗️ Project Structure

```
projectchurch/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── server/                # Backend Node.js application
│   ├── database/          # Database configuration and schema
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── ...
└── ...
```

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion
- **Responsive Design**: Mobile-first approach
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Modular and reusable components

### Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based authentication system
- **Database**: MySQL with connection pooling
- **Security**: Input validation, CORS, Helmet
- **BLOB Storage**: Database-based file storage for images and documents

### Database (MySQL)
- **User Management**: Members, admins, and guests
- **Events**: Church events and calendar
- **Sermons**: Sermon archives and media
- **Ministries**: Church programs and activities
- **Contact**: Contact form submissions
- **Resources**: File management system with BLOB storage
- **Gallery**: Image storage with metadata

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd projectchurch
```

### 2. Database Setup

1. **Start MySQL Server**
   - Make sure MySQL is running on your system
   - Default configuration: `localhost:3306`, user: `root`, no password

2. **Create Database**
   ```sql
   CREATE DATABASE larachurch;
   ```

3. **Run Database Schema**
   - The schema will be automatically created when you start the backend server

### 3. Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - The `config.env` file is already configured for local development
   - Update if needed for your specific setup

4. **Start the backend server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

### 4. Frontend Setup

1. **Navigate back to root directory**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Database Configuration

Edit `server/config.env` to match your MySQL setup:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=larachurch
DB_PORT=3306
```

### API Configuration

The frontend is configured to connect to `http://localhost:5000/api`. Update `src/services/api.ts` if you change the backend URL.

## 👤 Default Admin Account

A default admin account is created automatically:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@mtolives.org`

**⚠️ Important**: Change the default password after first login!

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)
- `GET /api/events/upcoming/events` - Get upcoming events

### Sermons
- `GET /api/sermons` - Get all sermons
- `GET /api/sermons/:id` - Get single sermon
- `POST /api/sermons` - Create sermon (Admin)
- `PUT /api/sermons/:id` - Update sermon (Admin)
- `DELETE /api/sermons/:id` - Delete sermon (Admin)
- `GET /api/sermons/latest/sermons` - Get latest sermons

### Ministries
- `GET /api/ministries` - Get all ministries
- `GET /api/ministries/:id` - Get single ministry
- `POST /api/ministries` - Create ministry (Admin)
- `PUT /api/ministries/:id` - Update ministry (Admin)
- `DELETE /api/ministries/:id` - Delete ministry (Admin)
- `GET /api/ministries/active/ministries` - Get active ministries

### Contact
- `POST /api/contact` - Submit contact message
- `GET /api/contact` - Get all messages (Admin)
- `GET /api/contact/:id` - Get single message (Admin)
- `PUT /api/contact/:id/read` - Mark as read (Admin)
- `DELETE /api/contact/:id` - Delete message (Admin)

### Files (BLOB Storage)
- `POST /api/files/gallery` - Upload gallery image (Admin)
- `GET /api/files/gallery/:id` - Get gallery image
- `POST /api/files/resources` - Upload resource file (Admin)
- `GET /api/files/resources/:id` - Get resource file
- `POST /api/files/sermons/:id/media` - Upload sermon media (Admin)
- `GET /api/files/sermons/:id/:mediaType` - Get sermon media

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Admin)

## 🎨 Customization

### Styling
- The application uses Tailwind CSS for styling
- Custom styles can be added in `src/index.css`
- Component-specific styles are in their respective files

### Content
- Update church information in the components
- Modify service times, location, and contact details
- Add your own images and media content

### Features
- Add new pages by creating components in `src/pages/`
- Extend the API by adding new routes in `server/routes/`
- Modify database schema in `server/database/schema.sql`

## 🚀 Deployment

### Backend Deployment
1. Set up a production MySQL database
2. Update environment variables for production
3. Install dependencies: `npm install --production`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your web server
3. Update API base URL for production

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Configured for security
- **Helmet**: Security headers middleware
- **SQL Injection Protection**: Parameterized queries

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure MySQL is running
   - Check database credentials in `config.env`
   - Verify database exists

2. **Port Already in Use**
   - Change port in `config.env` or kill existing process
   - Backend: `PORT=5000`
   - Frontend: `5173` (Vite default)

3. **CORS Errors**
   - Check CORS configuration in `server/server.js`
   - Ensure frontend URL is in allowed origins

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run lint`

## 📞 Support

For support or questions:
- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Mt. Olives SDA Church** 