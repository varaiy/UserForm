import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Simple admin credentials (in a real app, this would be handled by a backend)
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (credentials.username === ADMIN_USERNAME && credentials.password === ADMIN_PASSWORD) {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Admin Login</h1>
      <p className="page-subtitle">Enter your admin credentials</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
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
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/Selection')}
        >
          Back to User Selection
        </button>
      </form>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        <p>Demo Credentials:</p>
        <p>Username: admin | Password: admin123</p>
      </div>
    </div>
  );
};

export default AdminLogin;

