import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { setStoredToken, isAuthenticated } from '../../utils/auth';
import './styles.css';

const Signin = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? 'http://localhost:3000/signup' : 'http://localhost:3000/login';
      const requestBody = isSignup 
        ? {
            user: {
              email: formData.email,
              password: formData.password,
              name: formData.name,
              role: 0
            }
          }
        : {
            user: {
              email: formData.email,
              password: formData.password
            }
          };

      const response = await axios.post(endpoint, requestBody);
      
      const token = response.headers.authorization;
      
      if (token) {
        // Clean token if it has 'Bearer ' prefix
        const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
        
        // Store JWT token using utility function
        setStoredToken(cleanToken);
        
        // Store user name if available in response or form data
        const userName = response.data?.user?.name || response.data?.name || (isSignup ? formData.name : '');
        if (userName) {
          localStorage.setItem('user_name', userName);
        }
        
        console.log('JWT token stored successfully');
        
        // Redirect to home page after successful signin/signup
        navigate('/');
      } else {
        setError('No JWT token received from server');
      }
    } catch (err) {
      console.error(isSignup ? 'Signup error:' : 'Signin error:', err);
      setError(err.response?.data?.message || `${isSignup ? 'Signup' : 'Signin'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <div className="form-toggle">
          <button 
            type="button"
            className={`toggle-button ${!isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(false)}
          >
            Signin
          </button>
          <button 
            type="button"
            className={`toggle-button ${isSignup ? 'active' : ''}`}
            onClick={() => setIsSignup(true)}
          >
            Signup
          </button>
        </div>
        
        <h1>{isSignup ? 'Signup' : 'Signin'}</h1>
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="signin-button"
            disabled={loading}
          >
            {loading ? (isSignup ? 'Signing up...' : 'Signing in...') : (isSignup ? 'Signup' : 'Signin')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
