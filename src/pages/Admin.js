/**
 * Admin Dashboard Component
 * 
 * This component provides a simple interface for admins to add new users.
 * Admin can add users by providing their email and password.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  // Form state for adding new users
  const [formData, setFormData] = useState({
    email: '',      // User's email address
    password: ''    // User's password
  });
  const [errors, setErrors] = useState({}); // Form validation errors
  const [successMessage, setSuccessMessage] = useState(''); // Success message after adding user
  const navigate = useNavigate(); // React Router navigation hook

  /**
   * Effect hook: Runs on component mount
   * - Checks if admin is logged in (redirects to login if not)
   */
  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  /**
   * Handles form input changes
   * Updates form data and clears any existing errors for that field
   * @param {Event} e - Change event from input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /**
   * Validates the add user form
   * Checks if email and password are provided and email format is valid
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validate = () => {
    const newErrors = {};

    // Validate email: required and must be valid format
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // Basic email format validation (contains @ and .)
      newErrors.email = 'Email is invalid';
    }

    // Validate password: required and minimum length
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if no errors
  };

  /**
   * Handles form submission for adding a new user
   * Validates form, saves user to localStorage, and resets form
   * @param {Event} e - Form submit event
   */
  const handleAddUser = (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validate()) {
      return;
    }

    // Get existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user with this email already exists
    const userExists = existingUsers.some(user => user.email === formData.email);
    if (userExists) {
      setErrors({ email: 'User with this email already exists' });
      return;
    }

    // Create new user object
    const newUser = {
      id: Date.now(), // Unique ID based on timestamp
      email: formData.email,
      password: formData.password, // In production, this should be hashed
      createdAt: new Date().toISOString()
    };

    // Add new user to the list
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Show success message
    setSuccessMessage('User added successfully!');

    // Reset form
    setFormData({
      email: '',
      password: ''
    });
    setErrors({});

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  /**
   * Handles admin logout
   * - Removes login status from localStorage
   * - Redirects to admin login page
   */
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  /**
   * Effect hook: Sets body background color for admin page
   * Changes background to light gray, restores gradient on unmount
   */
  useEffect(() => {
    document.body.style.background = '#f5f7fa';
    // Cleanup: restore original background when component unmounts
    return () => {
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Add new users to the system</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="add-user-form">
          <h2>Add New User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter user email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter user password"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Add User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
