
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Upload, 
  Image as ImageIcon, 
  Palette, 
  Smartphone,
  Monitor,
  Globe,
  Zap,
  CheckCircle,
  Copy,
  Star
} from 'lucide-react';
import { Helmet } from 'react-helmet';

const FaviconPage = () => {
  const [selectedColor, setSelectedColor] = useState('#0052FF');
  const [text, setText] = useState('R');

  const presetColors = [
    '#0052FF', '#FF5722', '#4CAF50', '#9C27B0', 
    '#FF9800', '#00BCD4', '#E91E63', '#795548'
  ];

  const faviconSizes = [
    { size: '16x16', description: 'Browser tab' },
    { size: '32x32', description: 'Desktop bookmark' },
    { size: '96x96', description: 'Desktop shortcut' },
    { size: '180x180', description: 'iOS home screen' },
    { size: '192x192', description: 'Android home screen' },
    { size: '512x512', description: 'PWA manifest' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Generation',
      description: 'Generate favicons in seconds'
    },
    {
      icon: Smartphone,
      title: 'Multi-Platform',
      description: 'iOS, Android, Windows compatible'
    },
    {
      icon: Monitor,
      title: 'All Sizes',
      description: 'From 16x16 to 512x512 pixels'
    },
    {
      icon: Globe,
      title: 'Web Optimized',
      description: 'Optimized for web performance'
    }
  ];

  const codeSnippet = `<!-- Add to your HTML <head> section -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Favicon Generator | RizzPay Tools</title>
        <meta name="description" content="Generate professional favicons for your RizzPay integration and websites." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <ImageIcon className="h-4 w-4 mr-1" />
            Design Tools
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Favicon Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional favicons for your website or RizzPay integration in multiple sizes and formats
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Favicon Generator</CardTitle>
                <CardDescription>
                  Create your favicon by uploading an image or using our text generator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text">Text to Favicon</TabsTrigger>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="text">Text</Label>
                          <Input
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text (1-2 characters)"
                            maxLength={2}
                            className="text-2xl text-center"
                          />
                        </div>
                        
                        <div>
                          <Label>Background Color</Label>
                          <div className="flex gap-2 mt-2 mb-4">
                            {presetColors.map((color) => (
                              <button
                                key={color}
                                className="w-8 h-8 rounded border-2 border-gray-200 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => setSelectedColor(color)}
                              />
                            ))}
                          </div>
                          <Input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-full h-12"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div 
                            className="w-32 h-32 rounded-lg flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg"
                            style={{ backgroundColor: selectedColor }}
                          >
                            {text || 'R'}
                          </div>
                          <p className="text-sm text-gray-600">Preview (128x128)</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Upload Your Image</p>
                      <p className="text-gray-600 mb-4">
                        PNG, JPG, or SVG. Recommended: 512x512px minimum
                      </p>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 pt-6 border-t">
                  <Button size="lg" className="w-full">
                    <Download className="h-5 w-5 mr-2" />
                    Generate & Download Favicon Pack
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sizes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Sizes</CardTitle>
                <CardDescription>
                  Your favicon pack will include all these sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faviconSizes.map((size, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{size.size}</p>
                        <p className="text-sm text-gray-600">{size.description}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Implementation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">HTML Implementation</CardTitle>
                <CardDescription>
                  Copy this code to your HTML head section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                  <pre>{codeSnippet}</pre>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    Use simple, recognizable symbols
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    High contrast colors work best
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    Test on different devices
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                    Keep it consistent with your brand
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaviconPage;
