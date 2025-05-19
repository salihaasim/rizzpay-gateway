
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileType2, Upload } from "lucide-react";
import Layout from '@/components/Layout';
import { toast } from 'sonner';

const FaviconPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setSelectedFile(file);

    // Create a preview URL for the selected image
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Free memory when this component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    // In a real application, you would upload the file to a server here
    // For now, we'll just simulate success
    toast.success('Favicon updated successfully!');
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Favicon Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileType2 className="h-5 w-5" />
              Update Website Favicon
            </CardTitle>
            <CardDescription>
              A favicon is a small icon that appears in browser tabs and bookmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="favicon">Upload New Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-muted">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Favicon preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <FileType2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <Input
                      id="favicon"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Recommended size: 32x32px or 64x64px, PNG or ICO format
                    </p>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="flex gap-2">
                <Upload className="h-4 w-4" />
                Update Favicon
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FaviconPage;
