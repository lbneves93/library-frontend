import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { isAuthenticated, getStoredToken } from '../../utils/auth';
import MemberDashboard from '../../components/MemberDashboard';
import LibrarianDashboard from '../../components/LibrarianDashboard';
import './styles.css';

function Home() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to signin page if not authenticated
      navigate('/signin');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = getStoredToken();
      
      const response = await axios.get('http://localhost:3000/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, don't render the component (redirect will happen)
  if (!isAuthenticated()) {
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  // Determine which dashboard to show based on response
  const isMember = dashboardData && dashboardData.borrowed_books !== undefined;
  const isLibrarian = dashboardData && dashboardData.total_books !== undefined;

  return (
    <div className="home-container">
      {isMember && (
        <MemberDashboard borrowedBooks={dashboardData.borrowed_books} />
      )}
      {isLibrarian && (
        <LibrarianDashboard dashboardData={dashboardData} />
      )}
      {!isMember && !isLibrarian && (
        <div className="unknown-dashboard">
          <h2>Dashboard</h2>
          <p>Unable to determine dashboard type.</p>
        </div>
      )}
    </div>
  );
}

export default Home;