import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  Bell, 
  MessageSquare,
  DollarSign,
  TrendingUp,
  Bot
} from "lucide-react";

export default function AdminDashboard() {
  const { theme } = useThemeStore();

  const adminModules = [
    {
      title: "لوحة الأرباح",
      description: "تحليل الإيرادات والأرباح",
      icon: <BarChart3 className="h-6 w-6" />,
      link: "/admin/profit-dashboard",
      color: theme === 'dark' ? 'bg-blue-900/30 border-blue-800 hover:bg-blue-900/50' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: "المستخدمين",
      description: "إدارة حسابات المستخدمين",
      icon: <Users className="h-6 w-6" />,
      link: "/admin/users",
      color: theme === 'dark' ? 'bg-green-900/30 border-green-800 hover:bg-green-900/50' : 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: "المنتجات",
      description: "إدارة المنتجات والمخزون",
      icon: <Package className="h-6 w-6" />,
      link: "/admin/products",
      color: theme === 'dark' ? 'bg-purple-900/30 border-purple-800 hover:bg-purple-900/50' : 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: "الطلبات",
      description: "إدارة طلبات العملاء",
      icon: <ShoppingCart className="h-6 w-6" />,
      link: "/admin/orders",
      color: theme === 'dark' ? 'bg-amber-900/30 border-amber-800 hover:bg-amber-900/50' : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
    },
    {
      title: "الفئات",
      description: "إدارة فئات المنتجات",
      icon: <Package className="h-6 w-6" />,
      link: "/admin/categories",
      color: theme === 'dark' ? 'bg-indigo-900/30 border-indigo-800 hover:bg-indigo-900/50' : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    },
    {
      title: "الإشعارات",
      description: "إدارة إشعارات التطبيق",
      icon: <Bell className="h-6 w-6" />,
      link: "/admin/notifications",
      color: theme === 'dark' ? 'bg-red-900/30 border-red-800 hover:bg-red-900/50' : 'bg-red-50 border-red-200 hover:bg-red-100'
    },
    {
      title: "بوت التلغرام",
      description: "إعدادات بوت التلغرام",
      icon: <Bot className="h-6 w-6" />,
      link: "/admin/telegram-bot",
      color: theme === 'dark' ? 'bg-cyan-900/30 border-cyan-800 hover:bg-cyan-900/50' : 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
    },
    {
      title: "الشريط المتحرك",
      description: "إدارة الشريط المتحرك",
      icon: <MessageSquare className="h-6 w-6" />,
      link: "/admin/marquee",
      color: theme === 'dark' ? 'bg-pink-900/30 border-pink-800 hover:bg-pink-900/50' : 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    },
    {
      title: "الإعدادات",
      description: "إعدادات النظام",
      icon: <Settings className="h-6 w-6" />,
      link: "/admin/settings",
      color: theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800/80' : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
    },
  ];

  // Mock summary data
  const summaryData = {
    totalRevenue: 25680.45,
    totalProfit: 10272.18,
    totalOrders: 342,
    pendingOrders: 18,
    lowStockItems: 5,
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            لوحة التحكم
          </h1>
          <p className="text-muted-foreground">
            مرحباً بك في لوحة تحكم متجر إكسسوارات الهواتف
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Revenue Card */}
          <Card className={`border ${
            theme === 'dark' 
              ? 'border-blue-800 bg-blue-950/30' 
              : 'border-blue-200 bg-blue-50/50'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>الإيرادات</span>
                <DollarSign className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summaryData.totalRevenue)}
              </div>
              <p className="text-sm text-muted-foreground">
                إجمالي الإيرادات هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          {/* Profit Card */}
          <Card className={`border ${
            theme === 'dark' 
              ? 'border-green-800 bg-green-950/30' 
              : 'border-green-200 bg-green-50/50'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>الأرباح</span>
                <TrendingUp className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(summaryData.totalProfit)}
              </div>
              <p className="text-sm text-muted-foreground">
                صافي الأرباح هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          {/* Orders Card */}
          <Card className={`border ${
            theme === 'dark' 
              ? 'border-amber-800 bg-amber-950/30' 
              : 'border-amber-200 bg-amber-50/50'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>الطلبات</span>
                <ShoppingCart className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData.totalOrders}
              </div>
              <p className="text-sm text-muted-foreground">
                إجمالي الطلبات هذا الشهر
              </p>
            </CardContent>
          </Card>
          
          {/* Pending Orders Card */}
          <Card className={`border ${
            theme === 'dark' 
              ? 'border-red-800 bg-red-950/30' 
              : 'border-red-200 bg-red-50/50'
          }`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>طلبات معلقة</span>
                <Bell className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-600'
                }`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summaryData.pendingOrders}
              </div>
              <p className="text-sm text-muted-foreground">
                طلبات تحتاج إلى معالجة
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminModules.map((module, index) => (
            <Link to={module.link} key={index} className="block">
              <Card className={`border transition-all duration-300 ${module.color}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <span className="ml-2">{module.icon}</span>
                    <span>{module.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-right">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}