import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setApiError('');

      try {
        const data = await api.login(formData.email, formData.password);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('registered', 'true');
          navigate('/selection');
        } else {
          setApiError('Login succeeded but no token received');
        }
      } catch (err) {
        setApiError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
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
            disabled={loading}
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
            disabled={loading}
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        {apiError && <div className="error-message">{apiError}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/admin/login')}
            style={{ marginTop: '10px' }}
            disabled={loading}
          >
            Admin Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

