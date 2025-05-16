
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AdminWhitelist: React.FC = () => {
  const [ipAddress, setIpAddress] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [ipDescription, setIpDescription] = React.useState('');
  const [domainDescription, setDomainDescription] = React.useState('');

  // Sample whitelist data (in a real app, fetch from API)
  const [ipWhitelist, setIpWhitelist] = React.useState([
    { id: 1, ipAddress: '192.168.1.1', description: 'Office Network', addedBy: 'Admin', addedOn: '2023-09-01' },
    { id: 2, ipAddress: '10.0.0.1', description: 'Developer Network', addedBy: 'Admin', addedOn: '2023-09-02' },
    { id: 3, ipAddress: '203.0.113.1', description: 'Client Office', addedBy: 'Admin', addedOn: '2023-09-05' },
  ]);

  const [domainWhitelist, setDomainWhitelist] = React.useState([
    { id: 1, domain: 'example.com', description: 'Main Website', addedBy: 'Admin', addedOn: '2023-09-01' },
    { id: 2, domain: 'dev-site.com', description: 'Development Website', addedBy: 'Admin', addedOn: '2023-09-03' },
    { id: 3, domain: 'client-portal.net', description: 'Client Portal', addedBy: 'Admin', addedOn: '2023-09-04' },
  ]);

  const handleAddIp = () => {
    if (!ipAddress) {
      toast.error('Please enter an IP address');
      return;
    }
    
    // Simple IP validation (basic format check)
    const ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    if (!ipPattern.test(ipAddress)) {
      toast.error('Please enter a valid IP address');
      return;
    }
    
    const newIp = {
      id: ipWhitelist.length + 1,
      ipAddress,
      description: ipDescription || 'No description',
      addedBy: 'Admin',
      addedOn: new Date().toISOString().split('T')[0]
    };
    
    setIpWhitelist([...ipWhitelist, newIp]);
    toast.success('IP address added to whitelist');
    setIpAddress('');
    setIpDescription('');
  };

  const handleAddDomain = () => {
    if (!domain) {
      toast.error('Please enter a domain');
      return;
    }
    
    // Simple domain validation
    const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainPattern.test(domain)) {
      toast.error('Please enter a valid domain');
      return;
    }
    
    const newDomain = {
      id: domainWhitelist.length + 1,
      domain,
      description: domainDescription || 'No description',
      addedBy: 'Admin',
      addedOn: new Date().toISOString().split('T')[0]
    };
    
    setDomainWhitelist([...domainWhitelist, newDomain]);
    toast.success('Domain added to whitelist');
    setDomain('');
    setDomainDescription('');
  };

  const removeIp = (id: number) => {
    setIpWhitelist(ipWhitelist.filter(ip => ip.id !== id));
    toast.success('IP address removed from whitelist');
  };

  const removeDomain = (id: number) => {
    setDomainWhitelist(domainWhitelist.filter(domain => domain.id !== id));
    toast.success('Domain removed from whitelist');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Whitelist Management</h1>
      
      <Tabs defaultValue="ip">
        <TabsList className="mb-6">
          <TabsTrigger value="ip">IP Whitelist</TabsTrigger>
          <TabsTrigger value="domain">Domain Whitelist</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ip">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add IP to Whitelist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="ip-address" className="text-sm font-medium">IP Address</label>
                    <Input
                      id="ip-address"
                      placeholder="e.g., 192.168.1.1"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="ip-description" className="text-sm font-medium">Description (Optional)</label>
                    <Input
                      id="ip-description"
                      placeholder="e.g., Office Network"
                      value={ipDescription}
                      onChange={(e) => setIpDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddIp}>Add to Whitelist</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>IP Whitelist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left">IP Address</th>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-left">Added By</th>
                        <th className="py-2 text-left">Added On</th>
                        <th className="py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipWhitelist.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-gray-500">No IP addresses in whitelist</td>
                        </tr>
                      ) : (
                        ipWhitelist.map((ip) => (
                          <tr key={ip.id} className="border-b">
                            <td className="py-2">{ip.ipAddress}</td>
                            <td className="py-2">{ip.description}</td>
                            <td className="py-2">{ip.addedBy}</td>
                            <td className="py-2">{ip.addedOn}</td>
                            <td className="py-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 h-8 px-2" 
                                onClick={() => removeIp(ip.id)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="domain">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Domain to Whitelist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="domain" className="text-sm font-medium">Domain</label>
                    <Input
                      id="domain"
                      placeholder="e.g., example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="domain-description" className="text-sm font-medium">Description (Optional)</label>
                    <Input
                      id="domain-description"
                      placeholder="e.g., Company Website"
                      value={domainDescription}
                      onChange={(e) => setDomainDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddDomain}>Add to Whitelist</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Domain Whitelist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left">Domain</th>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-left">Added By</th>
                        <th className="py-2 text-left">Added On</th>
                        <th className="py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domainWhitelist.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-gray-500">No domains in whitelist</td>
                        </tr>
                      ) : (
                        domainWhitelist.map((domain) => (
                          <tr key={domain.id} className="border-b">
                            <td className="py-2">{domain.domain}</td>
                            <td className="py-2">{domain.description}</td>
                            <td className="py-2">{domain.addedBy}</td>
                            <td className="py-2">{domain.addedOn}</td>
                            <td className="py-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 h-8 px-2" 
                                onClick={() => removeDomain(domain.id)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWhitelist;
