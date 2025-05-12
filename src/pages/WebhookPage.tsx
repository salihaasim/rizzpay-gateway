
import React from 'react';
import { Navigate } from 'react-router-dom';

const WebhookPage: React.FC = () => {
  // Redirect to the new Developer Integration page
  return <Navigate to="/developer" replace />;
};

export default WebhookPage;
