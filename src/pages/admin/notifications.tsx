import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, Plus, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/route-components";
import type { Notification, User } from "@/lib/db-types";

function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Notification dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    message: "",
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch notifications and users from the API
    // For now, we'll use mock data
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@admin.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Test User",
        email: "user@example.com",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    const mockNotifications: Notification[] = [
      {
        id: "1",
        userId: "2",
        message: "Your order #12345 has been shipped!",
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "2",
        message: "New products are available in your favorite category!",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    
    setUsers(mockUsers);
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);
  
  const handleOpenDialog = () => {
    setFormData({
      userId: users.length > 0 ? users[0].id || "" : "",
      message: "",
    });
    setDialogOpen(true);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, we would send this to the API
      // For now, we'll just update our local state
      const newNotification: Notification = {
        id: Date.now().toString(),
        userId: formData.userId,
        message: formData.message,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      toast({
        title: "Success",
        description: "Notification sent successfully",
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true, updatedAt: new Date().toISOString() } 
          : notification
      )
    );
    
    toast({
      title: "Success",
      description: "Notification marked as read",
    });
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    toast({
      title: "Success",
      description: "Notification deleted successfully",
    });
  };
  
  const getUserName = (userId: string) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : "Unknown User";
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Send New Notification
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium mb-1">To: {getUserName(notification.userId)}</p>
                      <p className="text-lg">{notification.message}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <Button 
                          size="icon" 
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id || "")}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="icon" 
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(notification.id || "")}
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Send Notification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Recipient</Label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Send Notification
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function ProtectedAdminNotificationsPage() {
  return <ProtectedRoute Component={AdminNotificationsPage} />;
}