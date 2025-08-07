import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Ministries } from './pages/Ministries';
import { Events } from './pages/Events';
import { Posts } from './pages/Posts';
import { SinglePost } from './pages/SinglePost';
import { SingleMinistry } from './pages/SingleMinistry';
import { SingleEvent } from './pages/SingleEvent';
import { Sermons } from './pages/Sermons';
import { SabbathSchool } from './pages/SabbathSchool';
import { Live } from './pages/Live';
import { Baptism } from './pages/Baptism';
import { Gallery } from './pages/Gallery';
import { Resources } from './pages/Resources';
import { EGiving } from './pages/EGiving';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { MemberPortal } from './pages/MemberPortal';
import { AdminDashboard } from './pages/AdminDashboard';

// Component to conditionally render layout
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  
  if (isAdminPage) {
    // Full-screen admin layout without navbar and footer
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {children}
      </div>
    );
  }
  
  // Public layout with navbar and footer
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
                  <Router>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/ministries" element={<Ministries />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<SingleEvent />} />
              <Route path="/posts" element={<Posts />} />
            <Route path="/posts/:slug" element={<SinglePost />} />
            <Route path="/ministries/:slug" element={<SingleMinistry />} />
              <Route path="/sermons" element={<Sermons />} />
              <Route path="/sabbath-school" element={<SabbathSchool />} />
              <Route path="/live" element={<Live />} />
              <Route path="/baptism" element={<Baptism />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/e-giving" element={<EGiving />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Authentication Pages */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Pages */}
              <Route path="/member-portal" element={
                <ProtectedRoute requiredRole="member">
                  <MemberPortal />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;