
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  /**
   * Effect: Authentication check
   * Redirects to admin login if not logged in
   */
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  /**
   * Effect: Set dashboard background
   */
  useEffect(() => {
    document.body.style.background = '#f5f7fa';
    return () => {
      document.body.style.background =
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    };
  }, []);

  /**
   * Handles admin logout
   */
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Hospital Charity Dashboard</h1>
          <p className="dashboard-subtitle">
            Food Distribution Management System
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-outline">Export Report</button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ================= STATS SUMMARY ================= */}
      <div className="stats-container">
        <div className="stat-card">
          <p className="stat-title">Total Registered</p>
          <h2 className="stat-value">8</h2>
          <span className="stat-desc">All users in system</span>
        </div>

        <div className="stat-card active">
          <p className="stat-title">Active QR Codes</p>
          <h2 className="stat-value">5</h2>
          <span className="stat-desc">Ready to claim</span>
        </div>

        <div className="stat-card used">
          <p className="stat-title">Food Claimed</p>
          <h2 className="stat-value">2</h2>
          <span className="stat-desc">Already used</span>
        </div>

        <div className="stat-card invalid">
          <p className="stat-title">Invalid Codes</p>
          <h2 className="stat-value">1</h2>
          <span className="stat-desc">Face not matched</span>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, ID, or mobile..."
        />

        <select className="filter-select">
          <option>All Status</option>
          <option>Active</option>
          <option>Used</option>
          <option>Invalid</option>
        </select>

        <select className="filter-select">
          <option>All Types</option>
          <option>Guest</option>
          <option>Attendant</option>
        </select>
      </div>

    </div>
  );
};

export default Admin;
