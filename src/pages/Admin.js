
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

  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(5);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All Status');
  const [typeFilter, setTypeFilter] = React.useState('All Types');

  // Mock Data
  const [users] = React.useState([
    { id: '1001', name: 'Rahul Kumar', type: 'Guest', mobile: '9876543210', createdAt: '2023-10-25 10:30 AM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/men/1.jpg', email: 'rahul@example.com', address: '123 MG Road, Mumbai' },
    { id: '1002', name: 'Priya Singh', type: 'Staff', mobile: '8765432109', createdAt: '2023-10-24 02:15 PM', qrStatus: 'Invalid', photo: 'https://randomuser.me/api/portraits/women/2.jpg', email: 'priya@hospital.com', department: 'Nursing' },
    { id: '1003', name: 'Amit Shah', type: 'Guest', mobile: '7654321098', createdAt: '2023-10-26 09:00 AM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/men/3.jpg', email: 'amit@example.com', address: '456 Linking Road' },
    { id: '1004', name: 'Sneha Patel', type: 'Attendant', mobile: '6543210987', createdAt: '2023-10-25 04:45 PM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/women/4.jpg', email: 'sneha@example.com', patientId: 'P-505' },
    { id: '1005', name: 'Vikram Malhotra', type: 'Guest', mobile: '9988776655', createdAt: '2023-10-23 11:20 AM', qrStatus: 'Used', photo: 'https://randomuser.me/api/portraits/men/5.jpg', email: 'vikram@example.com', address: '789 Juhu Beach' },
    { id: '1006', name: 'Anjali Gupta', type: 'Staff', mobile: '9876500001', createdAt: '2023-10-22 01:10 PM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/women/6.jpg', email: 'anjali@hospital.com', department: 'Pediatrics' },
    { id: '1007', name: 'Rohan Sharma', type: 'Guest', mobile: '9876500002', createdAt: '2023-10-21 10:00 AM', qrStatus: 'Invalid', photo: 'https://randomuser.me/api/portraits/men/7.jpg', email: 'rohan@example.com', address: 'Sector 45, Noida' },
    { id: '1008', name: 'Meera Reddy', type: 'Attendant', mobile: '9876500003', createdAt: '2023-10-20 03:30 PM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/women/8.jpg', email: 'meera@example.com', patientId: 'P-302' },
    { id: '1009', name: 'Arjun Das', type: 'Guest', mobile: '9876500004', createdAt: '2023-10-19 12:45 PM', qrStatus: 'Used', photo: 'https://randomuser.me/api/portraits/men/9.jpg', email: 'arjun@example.com', address: 'Park Street, Kolkata' },
    { id: '1010', name: 'Kavita Nair', type: 'Staff', mobile: '9876500005', createdAt: '2023-10-18 09:15 AM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/women/10.jpg', email: 'kavita@hospital.com', department: 'Cardiology' },
    { id: '1011', name: 'Suresh Verma', type: 'Guest', mobile: '9876500006', createdAt: '2023-10-17 05:20 PM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/men/11.jpg', email: 'suresh@example.com', address: 'Anna Nagar, Chennai' },
    { id: '1012', name: 'Pooja Joshi', type: 'Attendant', mobile: '9876500007', createdAt: '2023-10-16 11:55 AM', qrStatus: 'Invalid', photo: 'https://randomuser.me/api/portraits/women/12.jpg', email: 'pooja@example.com', patientId: 'P-112' },
    { id: '1013', name: 'Manish Tiwari', type: 'Staff', mobile: '9876500008', createdAt: '2023-10-15 08:30 AM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/men/13.jpg', email: 'manish@hospital.com', department: 'Admin' },
    { id: '1014', name: 'Neha Kapoor', type: 'Guest', mobile: '9876500009', createdAt: '2023-10-14 02:25 PM', qrStatus: 'Used', photo: 'https://randomuser.me/api/portraits/women/14.jpg', email: 'neha@example.com', address: 'Model Town, Delhi' },
    { id: '1015', name: 'Rajesh Khanna', type: 'Guest', mobile: '9876500010', createdAt: '2023-10-13 10:40 AM', qrStatus: 'Valid', photo: 'https://randomuser.me/api/portraits/men/15.jpg', email: 'rajesh@example.com', address: 'Bandra, Mumbai' },
  ]);

  // Filtering Logic
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm) ||
        user.id.includes(searchTerm);

      const matchesStatus = statusFilter === 'All Status' || user.qrStatus === statusFilter;
      const matchesType = typeFilter === 'All Types' || user.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [users, searchTerm, statusFilter, typeFilter]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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
          <p className="stat-title">Total Food Coupons</p>
          <h2 className="stat-value">{users.length}</h2>
          <span className="stat-desc">All coupon in system</span>
        </div>

        <div className="stat-card active">
          <p className="stat-title">Active Food Coupons</p>
          <h2 className="stat-value">{users.filter(u => u.qrStatus === 'Valid').length}</h2>
          <span className="stat-desc">Ready to claim</span>
        </div>

        <div className="stat-card used">
          <p className="stat-title">Used Coupons</p>
          <h2 className="stat-value">{users.filter(u => u.qrStatus === 'Used').length}</h2>
          <span className="stat-desc">Already used</span>
        </div>

        <div className="stat-card invalid">
          <p className="stat-title">Invalid Coupons</p>
          <h2 className="stat-value">{users.filter(u => u.qrStatus === 'Invalid').length}</h2>
          <span className="stat-desc">Face not matched</span>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, ID, or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Valid</option>
          <option>Used</option>
          <option>Invalid</option>
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Guest</option>
          <option>Staff</option>
          <option>Attendant</option>
        </select>
      </div>

      {/* ================= USER TABLE ================= */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Mobile No.</th>
              <th>Created At</th>
              <th>QR Status</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className="user-cell">
                    <img src={user.photo} alt={user.name} className="user-avatar-small" />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>
                  <span className={`type-badge ${user.type.toLowerCase()}`}>{user.type}</span>
                </td>
                <td>{user.mobile}</td>
                <td>{user.createdAt}</td>
                <td>
                  <span className={`status-badge ${user.qrStatus.toLowerCase()}`}>{user.qrStatus}</span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => handleOpenModal(user)} title="View Details">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* ================= USER DETAILS MODAL ================= */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>&times;</button>

            <div className="modal-header">
              <img src={selectedUser.photo} alt={selectedUser.name} className="modal-avatar" />
              <div>
                <h2 className="modal-title">{selectedUser.name}</h2>
                <div className="modal-badges">
                  <span className={`type-badge ${selectedUser.type.toLowerCase()}`}>{selectedUser.type}</span>
                  <span className={`status-badge ${selectedUser.qrStatus.toLowerCase()}`}>{selectedUser.qrStatus}</span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">{selectedUser.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mobile:</span>
                <span className="detail-value">{selectedUser.mobile}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedUser.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Registered On:</span>
                <span className="detail-value">{selectedUser.createdAt}</span>
              </div>
              {selectedUser.address && (
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{selectedUser.address}</span>
                </div>
              )}
              {selectedUser.department && (
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedUser.department}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;
