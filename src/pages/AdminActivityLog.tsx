import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import AdminLayout from '@/components/admin/AdminLayout';
import ActivityLogTable from '@/components/admin/activity/ActivityLogTable';
import { useActivityLogStore } from '@/stores/activityLog';
import { Helmet } from 'react-helmet';

const AdminActivityLog = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { logs } = useActivityLogStore();
  
  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return (!startDate || logDate >= startDate) && 
           (!endDate || logDate <= new Date(endDate.setHours(23, 59, 59, 999)));
  });

  const exportToExcel = () => {
    const data = filteredLogs.map(log => ({
      Timestamp: format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      'Activity Type': log.activityType.replace(/_/g, ' '),
      User: log.userEmail || 'System',
      Description: log.details.description || '',
      Amount: log.details.amount || '',
      'Transaction ID': log.details.transactionId || ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Logs');
    
    const fileName = `Activity_Logs_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Activity logs exported successfully!');
  };

  return (
    <AdminLayout hideNavigation={true}>
      <Helmet>
        <title>Activity Logs | RizzPay Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Activity Logs</h1>
            <p className="text-muted-foreground mt-1">
              Monitor all system activities and transactions
            </p>
          </div>
          
          <Button onClick={exportToExcel} disabled={filteredLogs.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[200px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ActivityLogTable logs={filteredLogs} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
