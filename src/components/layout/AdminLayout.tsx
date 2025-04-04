import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  Bell, 
  MessageSquare,
  Menu,
  X,
  LogOut,
  Home,
  User,
  Bot,
  DollarSign
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      title: "لوحة التحكم",
      icon: <Home className="h-5 w-5" />,
      link: "/admin",
    },
    {
      title: "لوحة الأرباح",
      icon: <BarChart3 className="h-5 w-5" />,
      link: "/admin/profit-dashboard",
    },
    {
      title: "المستخدمين",
      icon: <Users className="h-5 w-5" />,
      link: "/admin/users",
    },
    {
      title: "المنتجات",
      icon: <Package className="h-5 w-5" />,
      link: "/admin/products",
    },
    {
      title: "الطلبات",
      icon: <ShoppingCart className="h-5 w-5" />,
      link: "/admin/orders",
    },
    {
      title: "الفئات",
      icon: <Package className="h-5 w-5" />,
      link: "/admin/categories",
    },
    {
      title: "الإشعارات",
      icon: <Bell className="h-5 w-5" />,
      link: "/admin/notifications",
    },
    {
      title: "بوت التلغرام",
      icon: <Bot className="h-5 w-5" />,
      link: "/admin/telegram-bot",
    },
    {
      title: "الشريط المتحرك",
      icon: <MessageSquare className="h-5 w-5" />,
      link: "/admin/marquee",
    },
    {
      title: "الإعدادات",
      icon: <Settings className="h-5 w-5" />,
      link: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`py-3 px-4 border-b ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {isMobile ? (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className={`p-0 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'
                }`}>
                  <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between">
                      <h2 className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        لوحة التحكم
                      </h2>
                      <Button variant="ghost" size="icon" onClick={closeSidebar}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <Separator className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} />
                    <nav className="flex-1 overflow-y-auto py-4">
                      <ul className="space-y-1 px-2">
                        {menuItems.map((item, index) => (
                          <li key={index}>
                            <Link 
                              to={item.link} 
                              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                location.pathname === item.link
                                  ? theme === 'dark' 
                                    ? 'bg-blue-900/50 text-blue-300' 
                                    : 'bg-blue-100 text-blue-700'
                                  : theme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-800'
                                    : 'text-slate-700 hover:bg-slate-100'
                              }`}
                              onClick={closeSidebar}
                            >
                              <span className="ml-3">{item.icon}</span>
                              <span>{item.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    <Separator className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} />
                    <div className="p-4">
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link to="/admin" className={`text-xl font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                لوحة التحكم
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className={`text-sm ${
              theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}>
              العودة للمتجر
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt={user?.name || "المستخدم"} />
                    <AvatarFallback className={
                      theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
                    }>
                      {user?.name?.charAt(0) || "م"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "المستخدم"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <User className="ml-2 h-4 w-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  <Settings className="ml-2 h-4 w-4" />
                  <span>الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        {!isMobile && (
          <aside className={`w-64 border-l flex-shrink-0 ${
            theme === 'dark' 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-white border-slate-200'
          }`}>
            <nav className="h-full py-6 px-3">
              <ul className="space-y-1">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.link} 
                      className={`flex items-center px-3 py-2 rounded-md ${
                        location.pathname === item.link
                          ? theme === 'dark' 
                            ? 'bg-blue-900/50 text-blue-300' 
                            : 'bg-blue-100 text-blue-700'
                          : theme === 'dark'
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="ml-3">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
        
        {/* Page Content */}
        <main className={`flex-1 ${
          theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}