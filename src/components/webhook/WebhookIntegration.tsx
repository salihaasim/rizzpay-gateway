
import React from 'react';
import ApiKeyDisplay from './ApiKeyDisplay';
import CodeExamples from './CodeExamples';

interface WebhookIntegrationProps {
  apiKey: string | null;
  onRegenerateApiKey?: () => void;
  isRegenerating?: boolean;
}

const WebhookIntegration: React.FC<WebhookIntegrationProps> = ({
  apiKey,
  onRegenerateApiKey,
  isRegenerating = false
}) => {
  const baseUrl = window.location.origin;
  const webhookEndpoint = `${baseUrl}/api/webhook`;

  return (
    <>
      <ApiKeyDisplay 
        apiKey={apiKey}
        onRegenerateApiKey={onRegenerateApiKey}
        isRegenerating={isRegenerating}
      />

      {apiKey && (
        <CodeExamples 
          apiKey={apiKey}
          webhookEndpoint={webhookEndpoint}
        />
      )}
    </>
  );
};

export default WebhookIntegration;
