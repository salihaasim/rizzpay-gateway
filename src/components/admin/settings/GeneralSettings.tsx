
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
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="platform-name">Platform Name</Label>
            <div className="text-sm text-muted-foreground">
              This will be displayed throughout the application
            </div>
          </div>
          <Input 
            id="platform-name" 
            value="RizzPay" 
            className="max-w-xs" 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Maintenance Mode</Label>
            <div className="text-sm text-muted-foreground">
              Put the platform in maintenance mode
            </div>
          </div>
          <Switch />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label>Default Currency</Label>
            <div className="text-sm text-muted-foreground">
              Set the default currency for transactions
            </div>
          </div>
          <Select defaultValue="inr">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inr">Indian Rupee (INR)</SelectItem>
              <SelectItem value="usd">US Dollar (USD)</SelectItem>
              <SelectItem value="eur">Euro (EUR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
