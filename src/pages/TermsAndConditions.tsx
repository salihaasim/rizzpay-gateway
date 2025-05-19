
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const TermsAndConditions = () => {
  const [isViewingPrintable, setIsViewingPrintable] = useState(false);
  
  const togglePrintableView = () => {
    setIsViewingPrintable(!isViewingPrintable);
  };
  
  const printDocument = () => {
    window.print();
  };
  
  const downloadPdf = () => {
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };
  
  return (
    <>
      <Helmet>
        <title>Terms and Conditions | RizzPay</title>
      </Helmet>
      
      <div className={`min-h-screen bg-background ${isViewingPrintable ? 'p-8' : 'py-8'}`}>
        {!isViewingPrintable && (
          <header className="container mx-auto px-4 mb-8">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-primary hover:text-primary/90 flex items-center">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={togglePrintableView}>
                  <Pin className="h-4 w-4 mr-2" />
                  Printable Version
                </Button>
                <Button variant="outline" size="sm" onClick={downloadPdf}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </header>
        )}
        
        <main className={`container mx-auto ${isViewingPrintable ? '' : 'px-4'} max-w-3xl`}>
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1 className="mb-6 text-3xl font-bold">RizzPay Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Effective Date: May 15, 2025</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p>This Privacy Policy describes how RizzPay ("we," "our," or "us") collects, uses, discloses, and safeguards the personal and transactional data of merchants, partners, and users interacting with our payment infrastructure.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <p>We may collect the following categories of information:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Personal Identification Details: Name, email address, phone number, and identity documents (PAN, Aadhaar, GSTIN, etc.)</li>
                <li>Business Information: Merchant business details, registration certificates, and bank account information</li>
                <li>Transactional Data: Payment history, UPI IDs, transaction values, timestamps, device metadata, and IP address</li>
                <li>Usage Data: Browser information, device logs, and activity on our dashboard or API endpoints</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p>We use collected data to:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Verify merchant identity and comply with KYC/AML requirements</li>
                <li>Process, reconcile, and settle payments securely</li>
                <li>Provide merchant support and operational notifications</li>
                <li>Detect fraud, enforce compliance, and mitigate risks</li>
                <li>Improve our platform, analytics, and user experience</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Data Sharing & Disclosure</h2>
              <p>We do not sell your data. However, data may be shared with:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Banking Partners & Payment Networks: For transaction processing and settlement</li>
                <li>Regulatory Authorities: If required by law or regulatory mandate (e.g., RBI, NPCI, FIU-IND)</li>
                <li>Third-Party Service Providers: For KYC verification, fraud detection, and cloud hosting—all under strict confidentiality agreements</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
              <p>We retain personal and transactional data as long as necessary to:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Comply with legal, tax, and regulatory obligations</li>
                <li>Resolve disputes and enforce our agreements</li>
                <li>Provide ongoing services and customer support</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
              <p>We implement strong technical and organizational safeguards to protect your data, including:</p>
              <ul className="list-disc list-inside mt-2">
                <li>AES-256 encryption of sensitive information</li>
                <li>Role-based access control and audit logging</li>
                <li>Secure APIs and TLS protocols</li>
              </ul>
              <p className="mt-2">However, no system is 100% secure. Users are responsible for protecting their own account credentials.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Your Rights</h2>
              <p>As a user, you have the right to:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Access the data we hold about you</li>
                <li>Request correction or deletion of incorrect data</li>
                <li>Withdraw consent where applicable</li>
                <li>Lodge a complaint with a data protection authority, if applicable</li>
              </ul>
              <p className="mt-2">Requests can be made by emailing us at rizzpay1@gmail.com.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Policy Updates</h2>
              <p>This Privacy Policy may be updated periodically. Merchants will be notified of any material changes via email or dashboard notices. Continued use of services constitutes acceptance of the updated policy.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">9. Contact Information</h2>
              <p>If you have questions or concerns regarding this policy, contact us at:</p>
              <ul className="list-disc list-inside mt-2">
                <li>Email: rizzpay1@gmail.com</li>
                <li>Phone: +91-9080186106</li>
                <li>Address: RizzPay Headquarters, Chennai, India</li>
              </ul>
              <p className="mt-4">This policy is binding upon all users, merchants, and partners engaging with the RizzPay platform.</p>
            </section>
          </article>
        </main>
        
        {isViewingPrintable && (
          <div className="fixed bottom-4 right-4 z-50 print:hidden">
            <div className="flex gap-2">
              <Button onClick={printDocument}>
                <Pin className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={togglePrintableView}>
                Exit Print View
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TermsAndConditions;
