/**
 * Main App Component
 * 
 * This is the root component that sets up React Router and defines all routes.
 * Routes:
 * - / -> Redirects to /register (User Login)
 * - /register -> User Login page
 * - /selection -> Role selection page (Staff or Guest)
 * - /staff -> Staff registration page
 * - /guest -> Guest registration page
 * - /admin/login -> Admin login page
 * - /admin -> Admin dashboard
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Selection from './pages/Selection';
import Staff from './pages/Staff';
import Guest from './pages/Guest';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route: redirect to user login */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          
          {/* User routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/selection" element={<Selection />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/guest" element={<Guest />} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

