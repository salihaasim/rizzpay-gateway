
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Users, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['all'] },
    { id: 2, name: 'Merchant', permissions: ['view_transactions', 'process_payments'] },
    { id: 3, name: 'Support', permissions: ['view_transactions'] },
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDialog, setNewRoleDialog] = useState(false);
  
  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setRoles([...roles, { 
        id: roles.length + 1, 
        name: newRoleName.trim(), 
        permissions: [] 
      }]);
      setNewRoleName('');
      setNewRoleDialog(false);
      toast.success('New role created successfully');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Role Management</h3>
        <Dialog open={newRoleDialog} onOpenChange={setNewRoleDialog}>
          <DialogTrigger asChild>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Create New Role
            </Button>
          </DialogTrigger>
          <DialogContent>
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
              <div className="pt-3 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setNewRoleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRole}>
                  Create Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>
                    {role.permissions.join(', ')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Shield className="h-4 w-4 mr-1" />
                      Edit Permissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleManagement;
