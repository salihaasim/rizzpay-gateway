
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { PayoutRecord } from "./reconTypes";

interface Props {
  record: PayoutRecord;
  onManualOverride: (id: string, status: string, notes: string) => void;
  isProcessing: boolean;
}

const ReconciliationModal: React.FC<Props> = ({ record, onManualOverride, isProcessing }) => {
  const [newStatus, setNewStatus] = useState(record.reconciliationStatus);
  const [notes, setNotes] = useState("");

  const handleOverride = () => {
    onManualOverride(record.id, newStatus, notes);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-black">Payout ID</Label>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">{record.id}</div>
        </div>
        <div>
          <Label className="text-black">Transaction ID</Label>
          <div className="font-mono text-sm bg-gray-100 p-2 rounded">{record.transactionId}</div>
        </div>
        <div>
          <Label className="text-black">Amount</Label>
          <div className="text-lg font-semibold">
            ₹{record.amount.toLocaleString()}
          </div>
        </div>
        <div>
          <Label className="text-black">Current Status</Label>
          <div className="flex items-center gap-2">
            {record.reconciliationStatus === "matched" ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : record.reconciliationStatus === "unmatched" ? (
              <XCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Clock className="h-4 w-4 text-blue-500" />
            )}
            <span className="capitalize text-black">{record.reconciliationStatus}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-3 rounded">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Merchant:</strong> {record.merchant}
          </div>
          <div>
            <strong>Beneficiary:</strong> {record.beneficiary}
          </div>
          <div>
            <strong>Payout Method:</strong> {record.payoutMethod.replace("_", " ")}
          </div>
          <div>
            <strong>UTR Number:</strong> {record.utrNumber || "N/A"}
          </div>
          <div>
            <strong>Bank Status:</strong> {record.bankStatus || "Pending"}
          </div>
          <div>
            <strong>Created:</strong> {new Date(record.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {record.reconciliationStatus === "unmatched" && (
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Manual Override Required</span>
          </div>
          <div>
            <Label className="text-black">Override Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="border-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matched">Mark as Matched</SelectItem>
                <SelectItem value="unmatched">Keep Unmatched</SelectItem>
                <SelectItem value="manual">Manual Override</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-black">Override Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide reason for manual override..."
              rows={3}
              className="border-black"
            />
          </div>
          <Button
            onClick={handleOverride}
            disabled={isProcessing || !notes.trim()}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isProcessing ? "Processing..." : "Apply Manual Override"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReconciliationModal;
