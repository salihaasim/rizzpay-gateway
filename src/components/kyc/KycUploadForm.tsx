
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUp, IdCard, UserCheck } from "lucide-react";

const KycUploadForm: React.FC = () => {
  // This is a dummy component - no actual logic implemented
  return (
    <div className="space-y-8">
      {/* Personal ID Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <IdCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Personal Identification</h3>
        </div>
        <Separator />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="aadhaar-upload">Aadhaar Card</Label>
            <div className="flex items-center gap-2">
              <Input id="aadhaar-upload" type="file" className="cursor-pointer" />
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4 mr-1" /> Upload
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload a clear image of your Aadhaar card</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pan-upload">PAN Card</Label>
            <div className="flex items-center gap-2">
              <Input id="pan-upload" type="file" className="cursor-pointer" />
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4 mr-1" /> Upload
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload a clear image of your PAN card</p>
          </div>
        </div>
      </div>

      {/* Business Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Business Documents</h3>
        </div>
        <Separator />
        
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gst-certificate">GST Certificate</Label>
            <div className="flex items-center gap-2">
              <Input id="gst-certificate" type="file" className="cursor-pointer" />
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4 mr-1" /> Upload
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload your GST registration certificate</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gst-number">GST Number</Label>
            <Input id="gst-number" placeholder="Enter your GST Number" />
            <p className="text-xs text-muted-foreground">Enter your 15-digit GST identification number</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button className="w-full sm:w-auto">
          Submit for Verification
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">Your documents will be reviewed within 1-2 business days.</p>
      </div>
    </div>
  );
};

export default KycUploadForm;
