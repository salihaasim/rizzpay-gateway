
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GeneralSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage basic platform settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input 
              id="platform-name" 
              value="RizzPay" 
              className="w-full" 
            />
            <p className="text-sm text-muted-foreground">
              This will be displayed throughout the application
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-currency">Default Currency</Label>
            <Select defaultValue="inr">
              <SelectTrigger id="default-currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
                <SelectItem value="usd">US Dollar (USD)</SelectItem>
                <SelectItem value="eur">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Set the default currency for transactions
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            <p className="text-sm text-muted-foreground">
              Put the platform in maintenance mode
            </p>
          </div>
          <Switch id="maintenance-mode" />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <Label htmlFor="debug-mode">Debug Mode</Label>
            <p className="text-sm text-muted-foreground">
              Enable detailed error reporting for developers
            </p>
          </div>
          <Switch id="debug-mode" />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <Label htmlFor="notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Send email notifications for important events
            </p>
          </div>
          <Switch id="notifications" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
