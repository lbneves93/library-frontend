import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getStoredToken, removeStoredToken, removeStoredRole, isAuthenticated } from '../../utils/auth';
import './styles.css';

const UserMenu = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user name from localStorage
    const storedUserName = localStorage.getItem('user_name');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);


  const handleLogout = async () => {
    try {
      const token = getStoredToken();
      if (token) {
        await axios.delete('http://localhost:3000/logout', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and redirect, even if API call fails
      removeStoredToken();
      removeStoredRole();
      localStorage.removeItem('user_name');
      navigate('/signin');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Don't render if user is not authenticated
  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="user-menu-container">
      <button className="user-menu-button" onClick={toggleMenu}>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      
      {isMenuOpen && (
        <div className="user-menu-dropdown">
          <div className="user-info">
            <p className="welcome-text">Welcome, {userName || 'User'}</p>
          </div>
          <div className="menu-divider"></div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      
      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default UserMenu;
