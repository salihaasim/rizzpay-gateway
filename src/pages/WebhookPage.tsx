
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WebhookPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new Developer Integration page
    navigate('/developer');
  }, [navigate]);
  
  return (
    <div className="container py-6 flex justify-center items-center">
      <p>Redirecting to Developer Integration page...</p>
    </div>
  );
};

export default WebhookPage;
