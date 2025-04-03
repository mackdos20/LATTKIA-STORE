import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Users, Package, ShoppingBag, BarChart3, Settings, Bot, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we would fetch these stats from the API
        // For now, we'll use mock data
        const orders = await api.getOrders();
        const products = await api.getProducts();
        
        setStats({
          totalUsers: 5, // Mock data
          totalProducts: products.length,
          totalOrders: orders.length,
          pendingOrders: orders.filter(order => order.status === 'pending').length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          لوحة التحكم
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '...' : stats.totalUsers}
              </div>
              <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Package className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
                المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '...' : stats.totalProducts}
              </div>
              <p className="text-sm text-muted-foreground">إجمالي المنتجات</p>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ShoppingBag className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '...' : stats.totalOrders}
              </div>
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                بانتظار المراجعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? '...' : stats.pendingOrders}
              </div>
              <p className="text-sm text-muted-foreground">طلبات بانتظار المراجعة</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                إدارة المتجر
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/users">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-blue-700 hover:bg-blue-900/30' 
                      : 'border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  إدارة المستخدمين
                </Button>
              </Link>
              
              <Link to="/admin/categories">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-blue-700 hover:bg-blue-900/30' 
                      : 'border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  إدارة الفئات والأقسام
                </Button>
              </Link>
              
              <Link to="/admin/products">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-blue-700 hover:bg-blue-900/30' 
                      : 'border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  إدارة المنتجات
                </Button>
              </Link>
              
              <Link to="/admin/marquee">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-pink-700 hover:bg-pink-900/30 text-pink-400' 
                      : 'border-pink-300 hover:bg-pink-50 text-pink-600'
                  }`}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  إدارة الشريط المتحرك
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark'? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                إدارة الطلبات والإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/orders">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-blue-700 hover:bg-blue-900/30' 
                      : 'border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  جميع الطلبات
                </Button>
              </Link>
              
              <Link to="/admin/orders?status=pending">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-yellow-700 hover:bg-yellow-900/30 text-yellow-400' 
                      : 'border-yellow-300 hover:bg-yellow-50 text-yellow-600'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  طلبات بانتظار المراجعة
                </Button>
              </Link>
              
              <Link to="/admin/notifications">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-pink-700 hover:bg-pink-900/30 text-pink-400' 
                      : 'border-pink-300 hover:bg-pink-50 text-pink-600'
                  }`}
                >
                  <Package className="h-5 w-5 mr-2" />
                  إرسال إشعارات للعملاء
                </Button>
              </Link>
              
              <Link to="/admin/settings">
                <Button 
                  variant="outline" 
                  className={`w-full justify-start ${
                    theme === 'dark' 
                      ? 'border-green-700 hover:bg-green-900/30 text-green-400' 
                      : 'border-green-300 hover:bg-green-50 text-green-600'
                  }`}
                >
                  <Bot className="h-5 w-5 mr-2" />
                  إعدادات بوت تيليجرام
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;