
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CsvRecord } from "./reconTypes";

interface Props {
  csvData: CsvRecord[];
  selectedUnmatchedRecord: CsvRecord | null;
  setSelectedUnmatchedRecord: (v: CsvRecord | null) => void;
  manualOrderId: string;
  setManualOrderId: (v: string) => void;
  handleManualMatch: () => void;
}

const CSVPreviewTable: React.FC<Props> = ({
  csvData,
  selectedUnmatchedRecord,
  setSelectedUnmatchedRecord,
  manualOrderId,
  setManualOrderId,
  handleManualMatch
}) => (
  <div className="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-black">UTR Number</TableHead>
          <TableHead className="text-black">Amount</TableHead>
          <TableHead className="text-black">Narration</TableHead>
          <TableHead className="text-black">Date</TableHead>
          <TableHead className="text-black">Matching Status</TableHead>
          <TableHead className="text-black">Matched Order ID</TableHead>
          <TableHead className="text-black">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {csvData.map((record) => (
          <TableRow key={record.id} className={record.matched ? "bg-green-50" : "bg-red-50"}>
            <TableCell className="font-mono text-black">
              {record.utrNumber}
            </TableCell>
            <TableCell className="text-black">₹{record.amount.toLocaleString()}</TableCell>
            <TableCell className="text-black">{record.narration}</TableCell>
            <TableCell className="text-black">{record.date}</TableCell>
            <TableCell>
              {record.matched ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 border">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Matched
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200 border">
                  <XCircle className="h-3 w-3 mr-1" />
                  Unmatched
                </Badge>
              )}
            </TableCell>
            <TableCell className="font-mono text-black">
              {record.matchedOrderId || "N/A"}
            </TableCell>
            <TableCell>
              {!record.matched && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedUnmatchedRecord(record)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manual Match Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-black">UTR Number</Label>
                        <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                          {selectedUnmatchedRecord?.utrNumber}
                        </div>
                      </div>
                      <div>
                        <Label className="text-black">Amount</Label>
                        <div className="text-lg font-semibold">
                          ₹{selectedUnmatchedRecord?.amount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <Label className="text-black">Order ID to Match</Label>
                        <Input
                          value={manualOrderId}
                          onChange={e => setManualOrderId(e.target.value)}
                          placeholder="Enter order ID (e.g., RP123456)"
                          className="border-black"
                        />
                      </div>
                      <Button
                        onClick={handleManualMatch}
                        disabled={!manualOrderId.trim()}
                        className="w-full bg-black hover:bg-gray-800 text-white"
                      >
                        Match Record
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default CSVPreviewTable;
