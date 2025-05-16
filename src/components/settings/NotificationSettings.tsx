
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationSettingsProps {
  merchant?: any;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage your notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Notification settings content will go here */}
        <p>Notification settings content is under development.</p>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
