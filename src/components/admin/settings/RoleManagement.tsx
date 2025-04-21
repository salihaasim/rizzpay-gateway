
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Shield, Plus, Trash, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

// Define types for roles and permissions
interface Role {
  id: number;
  name: string;
  permissions: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: 'Admin', permissions: ['all'], createdAt: new Date().toISOString() },
    { id: 2, name: 'Merchant', permissions: ['view_transactions', 'process_payments'], createdAt: new Date().toISOString() },
    { id: 3, name: 'Support', permissions: ['view_transactions'], createdAt: new Date().toISOString() },
  ]);
  
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([
    { id: 'view_transactions', name: 'View Transactions', description: 'Can view transaction history', category: 'Transactions' },
    { id: 'process_payments', name: 'Process Payments', description: 'Can process new payments', category: 'Payments' },
    { id: 'manage_users', name: 'Manage Users', description: 'Can create and edit users', category: 'Users' },
    { id: 'view_reports', name: 'View Reports', description: 'Can view financial reports', category: 'Reports' },
    { id: 'manage_webhooks', name: 'Manage Webhooks', description: 'Can configure webhook endpoints', category: 'Integration' },
    { id: 'manage_api', name: 'Manage API', description: 'Can access API settings', category: 'Integration' },
    { id: 'all', name: 'All Permissions', description: 'Has access to all features', category: 'System' },
  ]);
  
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDialog, setNewRoleDialog] = useState(false);
  const [editRoleDialog, setEditRoleDialog] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we're on a mobile device
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Group permissions by category
  const permissionsByCategory = availablePermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
  
  // Set selected permissions when editing a role
  useEffect(() => {
    if (currentRole) {
      setSelectedPermissions(currentRole.permissions);
    } else {
      setSelectedPermissions([]);
    }
  }, [currentRole]);
  
  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setRoles([...roles, { 
          id: roles.length + 1, 
          name: newRoleName.trim(), 
          permissions: selectedPermissions,
          createdAt: new Date().toISOString()
        }]);
        setNewRoleName('');
        setSelectedPermissions([]);
        setNewRoleDialog(false);
        setIsLoading(false);
        toast.success('New role created successfully');
      }, 500);
    }
  };
  
  const handleEditRole = () => {
    if (currentRole) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setRoles(roles.map(role => 
          role.id === currentRole.id 
            ? { ...role, permissions: selectedPermissions, updatedAt: new Date().toISOString() } 
            : role
        ));
        setEditRoleDialog(false);
        setCurrentRole(null);
        setIsLoading(false);
        toast.success('Role updated successfully');
      }, 500);
    }
  };
  
  const handleDeleteRole = (roleId: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setRoles(roles.filter(role => role.id !== roleId));
        setIsLoading(false);
        toast.success('Role deleted successfully');
      }, 500);
    }
  };
  
  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev => {
      // If "all" is being toggled
      if (permissionId === 'all') {
        // If adding "all", return only "all"
        if (!prev.includes('all')) {
          return ['all'];
        } 
        // If removing "all", return empty array
        return [];
      }
      
      // If another permission is being toggled while "all" is selected, remove "all"
      if (prev.includes('all')) {
        const newPermissions = [permissionId];
        return newPermissions;
      }
      
      // Normal toggle behavior for other permissions
      if (prev.includes(permissionId)) {
        return prev.filter(p => p !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };
  
  const openEditDialog = (role: Role) => {
    setCurrentRole(role);
    setEditRoleDialog(true);
  };
  
  // Mobile-optimized permission list component
  const PermissionList = () => (
    <ScrollArea className="h-[300px] pr-4">
      {Object.entries(permissionsByCategory).map(([category, permissions]) => (
        <div key={category} className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
          <div className="space-y-2">
            {permissions.map(permission => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`permission-${permission.id}`}
                  checked={selectedPermissions.includes(permission.id)}
                  onCheckedChange={() => handleTogglePermission(permission.id)}
                />
                <div>
                  <Label 
                    htmlFor={`permission-${permission.id}`}
                    className="text-sm font-medium"
                  >
                    {permission.name}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {permission.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Role Management</h3>
        <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
          </DialogTrigger>
          <DialogContent className={isMobile ? "max-w-[90vw] p-4" : ""}>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input 
                  id="role-name" 
                  placeholder="Enter role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissions</Label>
                <PermissionList />
              </div>
              
              <div className="pt-3 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewRoleDialog(false);
                    setNewRoleName('');
                    setSelectedPermissions([]);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddRole}
                  disabled={!newRoleName.trim() || isLoading || selectedPermissions.length === 0}
                >
                  {isLoading ? 'Creating...' : 'Create Role'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className={isMobile ? "p-2" : "p-0"}>
          {isMobile ? (
            // Mobile view - card list
            <div className="space-y-4 py-2">
              {roles.map((role) => (
                <Card key={role.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{role.name}</h4>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditDialog(role)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteRole(role.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Created: {new Date(role.createdAt!).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.map(perm => {
                        const permission = availablePermissions.find(p => p.id === perm);
                        return (
                          <div 
                            key={perm} 
                            className="bg-secondary text-xs px-2 py-1 rounded-full"
                          >
                            {permission?.name || perm}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Desktop view - table
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map(perm => {
                          const permission = availablePermissions.find(p => p.id === perm);
                          return (
                            <div 
                              key={perm} 
                              className="bg-secondary text-xs px-2 py-1 rounded-full"
                            >
                              {permission?.name || perm}
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      {role.createdAt && new Date(role.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 mr-2"
                        onClick={() => openEditDialog(role)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialog} onOpenChange={setEditRoleDialog}>
        <DialogContent className={isMobile ? "max-w-[90vw] p-4" : ""}>
          <DialogHeader>
            <DialogTitle>Edit Role: {currentRole?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <Label>Permissions</Label>
              <PermissionList />
            </div>
            
            <div className="pt-3 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditRoleDialog(false);
                  setCurrentRole(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditRole}
                disabled={isLoading || selectedPermissions.length === 0}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
