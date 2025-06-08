
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Globe, MessageSquare } from 'lucide-react';
import LandingNavbar from '@/components/landing/LandingNavbar';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';

const ContactUs = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | RizzPay</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <LandingNavbar />
        <div className="container mx-auto px-4 py-12 flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {/* Email Contact */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">For general inquiries:</p>
                <a href="mailto:rizzpay1@gmail.com" className="text-primary hover:underline block mb-2">
                  rizzpay1@gmail.com
                </a>
                <p className="text-muted-foreground mb-2">For support:</p>
                <a href="mailto:support@rizzpay.com" className="text-primary hover:underline">
                  support@rizzpay.com
                </a>
              </CardContent>
            </Card>

            {/* Phone Contact */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Customer Support:</p>
                <a href="tel:+919080186106" className="text-primary hover:underline block mb-2">
                  +91 9080186106
                </a>
                <a href="tel:+917550248887" className="text-primary hover:underline block mb-2">
                  +91 7550248887
                </a>
                <p className="text-muted-foreground mb-2">WhatsApp Support:</p>
                <a href="https://wa.me/919080186106" className="text-primary hover:underline">
                  +91 9080186106
                </a>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Visit us at:</p>
                <address className="not-italic">
                  First Floor, 11/6, Ramanathan St,<br />
                  Mahalingapuram, Nungambakkam,<br />
                  Chennai, Tamil Nadu 600034<br />
                  India
                </address>
              </CardContent>
            </Card>

            {/* Live Chat */}
            <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Chat with our support team directly from your dashboard during business hours.</p>
                <p className="text-muted-foreground">
                  <strong>Business Hours:</strong><br />
                  Monday to Friday: 9:00 AM - 6:00 PM (IST)<br />
                  Saturday: 10:00 AM - 2:00 PM (IST)
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-8 shadow-md max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-primary" />
                About RizzPay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                RizzPay is a secure, fast, and reliable payment gateway solution for businesses and consumers.
                Our platform provides comprehensive payment capabilities with a focus on security and ease of use.
              </p>
              <p>
                Whether you need assistance with your merchant account, have questions about our services,
                or need technical support, our team is ready to help you through various channels.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <footer className="bg-background py-8 border-t mt-auto">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <img src={logoSvg} alt="RizzPay Logo" className="h-8 w-8 mr-2" />
                <span className="font-bold text-xl bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                  RizzPay
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4 md:mt-0">
                © {new Date().getFullYear()} RizzPay. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ContactUs;
