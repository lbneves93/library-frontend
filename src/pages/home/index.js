import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isAuthenticated } from '../../utils/auth';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to signin page if not authenticated
      navigate('/signin');
    }
  }, [navigate]);

  // If not authenticated, don't render the component (redirect will happen)
  if (!isAuthenticated()) {
    return null;
  }

  return(
    <></>
  )
}

export default Home;