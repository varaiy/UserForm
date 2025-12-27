/**
 * Selection Page Component
 * 
 * This component allows users to select their role after logging in.
 * Users can choose between "Staff" or "Guest" options.
 * Redirects to register page if user is not logged in.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Selection = () => {
  // State for selected role option
  const [selectedOption, setSelectedOption] = useState(null); // 'staff' or 'guest'
  const navigate = useNavigate(); // React Router navigation hook

  /**
   * Effect hook: Checks if user is logged in
   * Redirects to login page if user hasn't logged in
   */
  useEffect(() => {
    // Check if user is registered/logged in
    const isRegistered = localStorage.getItem('registered');
    if (!isRegistered) {
      navigate('/register');
    }
  }, [navigate]);

  /**
   * Handles role selection (Staff or Guest)
   * @param {string} option - Selected option: 'staff' or 'guest'
   */
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  /**
   * Handles continue button click
   * Navigates to appropriate page based on selected role
   */
  const handleContinue = () => {
    if (selectedOption === 'staff') {
      navigate('/staff'); // Navigate to staff registration page
    } else if (selectedOption === 'guest') {
      navigate('/guest'); // Navigate to guest registration page
    }
  };

  return (
    <div className="page-container selection-view">
      <h1 className="page-title">Select Your Role</h1>
      <p className="page-subtitle">Choose how you want to proceed</p>

      <div className="option-container">
        <div
          className={`option-card ${selectedOption === 'staff' ? 'selected' : ''}`}
          onClick={() => handleOptionSelect('staff')}
        >
          <div className="option-title">Staff</div>
          <div className="option-description">I am a staff member</div>
        </div>

        <div
          className={`option-card ${selectedOption === 'guest' ? 'selected' : ''}`}
          onClick={() => handleOptionSelect('guest')}
        >
          <div className="option-title">Guest</div>
          <div className="option-description">I am a guest visitor</div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleContinue}
        disabled={!selectedOption}
        style={{ opacity: selectedOption ? 1 : 0.5, cursor: selectedOption ? 'pointer' : 'not-allowed' }}
      >
        Continue
      </button>
      
    </div>
  );
};

export default Selection;

