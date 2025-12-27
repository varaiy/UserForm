import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login(credentials.email, credentials.password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        // Also keep adminLoggedIn for backward compatibility if needed, or remove it
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/admin');
      } else {
        setError('Login succeeded but no token received');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Login</h1>
      <p className="page-subtitle">Enter your admin credentials</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/register')}
          disabled={loading}
        >
          Back to Staff Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
