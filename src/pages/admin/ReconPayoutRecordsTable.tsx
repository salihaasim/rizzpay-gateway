
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, RefreshCw, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PayoutRecord } from "./reconTypes";
import ReconciliationModal from "./ReconciliationModal";

interface Props {
  records: PayoutRecord[];
  onView: (rec: PayoutRecord) => void;
  selectedRecord: PayoutRecord | null;
  onManualOverride: (id: string, status: string, notes: string) => void;
  isProcessing: boolean;
  onStatusCheck: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getPayoutStatusIcon: (status: string) => React.ReactNode;
}

const ReconPayoutRecordsTable: React.FC<Props> = ({
  records,
  onView,
  selectedRecord,
  onManualOverride,
  isProcessing,
  onStatusCheck,
  getStatusBadge,
  getPayoutStatusIcon
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-black">Payout ID</TableHead>
          <TableHead className="text-black">Transaction ID</TableHead>
          <TableHead className="text-black">Merchant</TableHead>
          <TableHead className="text-black">Amount</TableHead>
          <TableHead className="text-black">Payout Status</TableHead>
          <TableHead className="text-black">Bank Status</TableHead>
          <TableHead className="text-black">Reconciliation</TableHead>
          <TableHead className="text-black">UTR Number</TableHead>
          <TableHead className="text-black">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="font-medium text-black">{record.id}</TableCell>
            <TableCell className="font-mono text-black">{record.transactionId}</TableCell>
            <TableCell className="text-black">{record.merchant}</TableCell>
            <TableCell className="text-black">
              ₹{record.amount.toLocaleString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getPayoutStatusIcon(record.status)}
                <span className="capitalize text-black">{record.status}</span>
              </div>
            </TableCell>
            <TableCell>
              {record.bankStatus ? (
                <span
                  className={`capitalize ${
                    record.bankStatus === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {record.bankStatus}
                </span>
              ) : (
                <span className="text-gray-500">Pending</span>
              )}
            </TableCell>
            <TableCell>{getStatusBadge(record.reconciliationStatus)}</TableCell>
            <TableCell className="font-mono text-sm text-black">
              {record.utrNumber || "N/A"}
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(record)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        Payment Reconciliation Details
                      </DialogTitle>
                    </DialogHeader>
                    {selectedRecord && (
                      <ReconciliationModal
                        record={selectedRecord}
                        onManualOverride={onManualOverride}
                        isProcessing={isProcessing}
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onStatusCheck(record.id)}
                  disabled={isProcessing}
                  title="Check Bank Status"
                >
                  <RefreshCw className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ReconPayoutRecordsTable;
