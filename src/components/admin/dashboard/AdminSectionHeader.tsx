
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Wallet, ShieldCheck, CreditCard, BarChart3, Settings, Percent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSectionHeaderProps {
  section: string;
}

const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({ section }) => {
  const navigate = useNavigate();

  const title = () => {
    switch (section) {
      case 'merchants': return 'Merchant Management';
      case 'escrow': return 'Escrow Account';
      case 'pricing': return 'Merchant Pricing Control';
      case 'transactions': return 'Transaction Management';
      case 'analytics': return 'Analytics Dashboard';
      case 'settings': return 'Admin Settings';
      case 'whitelist': return 'Merchant Whitelist';
      default: return 'Admin Dashboard';
    }
  };
  
  const description = () => {
    switch (section) {
      case 'merchants': return 'Manage merchant accounts and permissions';
      case 'escrow': return 'Monitor and manage the platform escrow account';
      case 'pricing': return 'Control transaction fees and pricing for merchants';
      case 'transactions': return 'Monitor and manage payment transactions';
      case 'analytics': return 'Platform performance metrics and insights';
      case 'settings': return 'Configure platform settings and permissions';
      case 'whitelist': return 'Manage trusted merchants with privileged access';
      default: return 'Manage merchants and monitor platform performance';
    }
  };
  
  const icon = () => {
    switch (section) {
      case 'merchants': return <Users className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      case 'escrow': return <Wallet className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      case 'pricing': return <Percent className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      case 'transactions': return <CreditCard className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      case 'analytics': return <BarChart3 className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      case 'settings': return <Settings className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      case 'whitelist': return <ShieldCheck className="h-6 w-6 inline-block mr-2 text-blue-600" />;
      default: return <ShieldCheck className="h-6 w-6 inline-block mr-2 text-blue-600" />;
    }
  };

  return (
    <div className="admin-section-header flex items-center justify-between mb-8 p-4 bg-white rounded-lg border border-slate-200">
      <div>
        <h1 className="section-title text-2xl font-bold flex items-center text-blue-600">
          {icon()}
          {title()}
        </h1>
        <p className="text-slate-600 mt-1">
          {description()}
        </p>
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Merchant View
        </Button>
      </div>
    </div>
  );
};

export default AdminSectionHeader;
