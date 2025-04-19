
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Lock } from "lucide-react";

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Security</CardTitle>
          <CardDescription>
            Configure security settings for the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="authentication">
              <AccordionTrigger>Authentication Settings</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
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
                    <Label>Failed Login Attempts</Label>
                    <div className="text-sm text-muted-foreground">
                      Maximum failed login attempts before lockout
                    </div>
                  </div>
                  <Select defaultValue="5">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select attempts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="server">
              <AccordionTrigger>Server Security</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Restriction</Label>
                    <div className="text-sm text-muted-foreground">
                      Restrict admin access to specific IP addresses
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SSL Enforcement</Label>
                    <div className="text-sm text-muted-foreground">
                      Force SSL for all connections
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Rate Limiting</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable API rate limiting
                    </div>
                  </div>
                  <Select defaultValue="standard">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (100 req/min)</SelectItem>
                      <SelectItem value="standard">Standard (500 req/min)</SelectItem>
                      <SelectItem value="high">High (1000 req/min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment">
              <AccordionTrigger>Payment Security</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Transaction Signing</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable digital signatures for transactions
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Verification</Label>
                    <div className="text-sm text-muted-foreground">
                      Additional verification for large transactions
                    </div>
                  </div>
                  <Select defaultValue="high">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Above ₹10,000</SelectItem>
                      <SelectItem value="medium">Above ₹50,000</SelectItem>
                      <SelectItem value="high">Above ₹1,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Withdrawal Limits</Label>
                    <div className="text-sm text-muted-foreground">
                      Set daily withdrawal limits
                    </div>
                  </div>
                  <Input 
                    type="number" 
                    placeholder="Enter limit" 
                    className="w-[180px]"
                    defaultValue="100000"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
