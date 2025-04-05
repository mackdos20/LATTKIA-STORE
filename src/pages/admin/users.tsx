import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Edit, Plus, Trash2, UserPlus } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/route-components";
import type { User } from "@/lib/db-types";

function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // User dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await api.getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  const handleOpenDialog = (user?: User) => {
    if (user) {
      setFormData({
        id: user.id || "",
        name: user.name,
        email: user.email,
        password: "",
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // In a real app, we would update the user via API
        // For now, we'll just update our local state
        setUsers(prev => 
          prev.map(user => 
            user.id === formData.id 
              ? { 
                  ...user, 
                  name: formData.name, 
                  email: formData.email,
                  updatedAt: new Date().toISOString(),
                } 
              : user
          )
        );
        
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        // In a real app, we would create the user via API
        // For now, we'll just update our local state
        const newUser: User = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setUsers(prev => [...prev, newUser]);
        
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteUser = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      // In a real app, we would delete the user via API
      // For now, we'll just update our local state
      setUsers(prev => prev.filter(user => user.id !== id));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button onClick={() => handleOpenDialog()}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No users found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Created</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteUser(user.id || "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  value={formData.email} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              {!isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password"
                    value={formData.password} 
                    onChange={handleChange}
                    required={!isEditing}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function ProtectedAdminUsersPage() {
  return <ProtectedRoute Component={AdminUsersPage} />;
}