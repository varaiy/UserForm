/**
 * User Login Page Component
 * 
 * This component provides a login interface for users.
 * Users enter their email and password to access the selection page.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  // Form state for login credentials
  const [formData, setFormData] = useState({
    email: '',      // User's email address
    password: ''    // User's password
  });
  const [errors, setErrors] = useState({}); // Validation errors
  const navigate = useNavigate(); // React Router navigation hook

  /**
   * Handles input field changes
   * Updates form data and clears errors for the changed field
   * @param {Event} e - Change event from input field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validates the login form
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

    // Validate password: required
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Form is valid if no errors
  };

  /**
   * Handles form submission
   * Validates form and navigates to selection page on success
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Store login status (in a real app, this would be sent to a backend for authentication)
      localStorage.setItem('registered', 'true');
      // Navigate to selection page where user chooses Staff or Guest
      navigate('/selection');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Staff Login</h1>
      <p className="page-subtitle">Login to your account</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/admin/login')}
          style={{ marginTop: '10px' }}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default Register;

