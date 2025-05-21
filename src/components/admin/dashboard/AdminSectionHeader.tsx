
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Tag, 
  Shield, 
  Activity,
  ShoppingCart,
  BarChart3,
  Settings
} from 'lucide-react';

interface AdminSectionHeaderProps {
  section: string;
}

const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({ section }) => {
  // Define titles and descriptions for each section
  const sectionData = {
    dashboard: {
      title: 'Platform Overview',
      description: 'Monitor and manage your payment gateway platform',
      icon: <LayoutDashboard className="h-5 w-5 text-primary" />,
    },
    merchants: {
      title: 'Manage Merchants',
      description: 'View and manage merchant accounts',
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    escrow: {
      title: 'Escrow Account',
      description: 'Manage escrow funds and settlements',
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    pricing: {
      title: 'Pricing Control',
      description: 'Set transaction fees and pricing rules',
      icon: <Tag className="h-5 w-5 text-primary" />,
    },
    whitelist: {
      title: 'Access Control Whitelist',
      description: 'Manage authorized IP addresses and webhook domains',
      icon: <Shield className="h-5 w-5 text-primary" />,
    },
    monitoring: {
      title: 'System Monitoring',
      description: 'Monitor platform performance and status',
      icon: <Activity className="h-5 w-5 text-primary" />,
    },
    transactions: {
      title: 'Transactions',
      description: 'View and manage all payment transactions',
      icon: <ShoppingCart className="h-5 w-5 text-primary" />,
    },
    analytics: {
      title: 'Analytics Dashboard',
      description: 'Review performance metrics and insights',
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
    },
    settings: {
      title: 'Admin Settings',
      description: 'Configure platform settings and preferences',
      icon: <Settings className="h-5 w-5 text-primary" />,
    }
  };

  // Get the data for the current section, or use dashboard as default
  const currentSection = sectionData[section as keyof typeof sectionData] || sectionData.dashboard;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        {currentSection.icon}
        <h1 className="text-2xl font-bold">{currentSection.title}</h1>
      </div>
      <p className="text-muted-foreground">
        {currentSection.description}
      </p>
    </div>
  );
};

export default AdminSectionHeader;
