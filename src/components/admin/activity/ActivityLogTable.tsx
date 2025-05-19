
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityLog } from '@/stores/activityLog';

interface ActivityLogTableProps {
  logs: ActivityLog[];
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Activity Type</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono">
                {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </TableCell>
              <TableCell className="capitalize">
                {log.activityType.replace(/_/g, ' ')}
              </TableCell>
              <TableCell>{log.userEmail || 'System'}</TableCell>
              <TableCell>
                {log.details.description || 
                 (log.details.amount ? `Amount: ${log.details.amount}` : '')}
                {log.details.transactionId && (
                  <div className="text-xs text-muted-foreground mt-1">
                    ID: {log.details.transactionId}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityLogTable;
