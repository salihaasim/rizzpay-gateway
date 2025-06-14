
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface Props {
  isDragOver: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  csvFile: File | null;
}

const CSVUploadSection: React.FC<Props> = ({
  isDragOver,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
  csvFile
}) => (
  <Card className="bg-white border-2 border-black">
    <CardHeader className="bg-white">
      <CardTitle className="text-black">Upload Bank Statement CSV</CardTitle>
    </CardHeader>
    <CardContent>
      <div
        className={`border-2 border-dashed p-8 text-center ${
          isDragOver ? "border-blue-500 bg-blue-50" : "border-black"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-black mb-2">
          Drag and drop your CSV file here, or
        </p>
        <Label htmlFor="csv-file" className="cursor-pointer">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Browse Files
          </Button>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
          />
        </Label>
        {csvFile && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {csvFile.name}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

export default CSVUploadSection;
