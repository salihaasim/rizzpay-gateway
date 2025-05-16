
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SecuritySettingsProps {
  merchant?: any;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security preferences</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Security settings content will go here */}
        <p>Security settings content is under development.</p>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
