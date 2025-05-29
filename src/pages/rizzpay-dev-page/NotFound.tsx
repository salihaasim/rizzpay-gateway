
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <Helmet>
        <title>Page Not Found | RizzPay</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      
      <div className="max-w-2xl w-full text-center">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-blue-600 opacity-20 mb-4">
            404
          </div>
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Search className="h-16 w-16 md:h-20 md:w-20 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="backdrop-blur-sm bg-white/70 border-0 shadow-xl">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              The page you're looking for seems to have gone on a payment holiday. 
              Don't worry, we'll help you get back on track!
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="group">
                <Link to="/">
                  <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" onClick={handleGoBack} className="group">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Button>
              
              <Button variant="outline" size="lg" asChild className="group">
                <Link to="/contact">
                  <HelpCircle className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Get Help
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Dashboard
                </Link>
                <Link to="/transactions" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Transactions
                </Link>
                <Link to="/developer" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Developer Docs
                </Link>
                <Link to="/contact" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Support
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fun Error Code */}
        <div className="mt-8 text-sm text-gray-500">
          Error Code: PAYMENT_PAGE_NOT_FOUND_404
        </div>
      </div>
    </div>
  );
};

export default NotFound;
