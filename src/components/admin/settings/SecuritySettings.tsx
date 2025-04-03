
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure security options for the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Two-Factor Authentication</Label>
            <div className="text-sm text-muted-foreground">
              Require 2FA for admin users
            </div>
          </div>
          <Switch defaultChecked />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Session Timeout</Label>
            <div className="text-sm text-muted-foreground">
              Set the timeout period for inactive sessions
            </div>
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>IP Restriction</Label>
            <div className="text-sm text-muted-foreground">
              Restrict admin access to specific IP addresses
            </div>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
