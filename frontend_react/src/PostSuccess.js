import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PostSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for a short period (e.g., 1 second) and then navigate back to GeneralJournal
    const timeout = setTimeout(() => {
      navigate('/generalJournal');
    }, 100);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div>
      <p>Posting entries successful!</p>
      {/* You can add more content or styling if needed */}
    </div>
  );
};

export default PostSuccess;
