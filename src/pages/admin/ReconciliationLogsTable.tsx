
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { ReconciliationLog } from "./reconTypes";

interface Props {
  logs: ReconciliationLog[];
  onDownload: (logId: string) => void;
}

const ReconciliationLogsTable: React.FC<Props> = ({ logs, onDownload }) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-black">File Name</TableHead>
          <TableHead className="text-black">Upload Date</TableHead>
          <TableHead className="text-black">Total Records</TableHead>
          <TableHead className="text-black">Matched</TableHead>
          <TableHead className="text-black">Unmatched</TableHead>
          <TableHead className="text-black">Uploaded By</TableHead>
          <TableHead className="text-black">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map(log => (
          <TableRow key={log.id}>
            <TableCell className="font-medium text-black flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {log.fileName}
            </TableCell>
            <TableCell className="text-black">
              {new Date(log.uploadedAt).toLocaleString()}
            </TableCell>
            <TableCell className="text-black">{log.totalRecords}</TableCell>
            <TableCell>
              <span className="text-green-600 font-medium">{log.matchedRecords}</span>
            </TableCell>
            <TableCell>
              <span className="text-red-600 font-medium">{log.unmatchedRecords}</span>
            </TableCell>
            <TableCell className="text-black">{log.uploadedBy}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" title="Download Report" onClick={() => onDownload(log.id)}>
                <Download className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ReconciliationLogsTable;
