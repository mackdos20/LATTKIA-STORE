import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "./theme-provider";
import { ThemeToggle } from "./ThemeToggle";
import { 
  BarChart3, 
  Bell, 
  ChevronRight, 
  Home, 
  Layers, 
  LogOut, 
  Menu, 
  Package, 
  Settings, 
  ShoppingCart, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: Home },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
    { name: "Profit Dashboard", path: "/admin/profit", icon: BarChart3 },
    { name: "Telegram Bot", path: "/admin/telegram", icon: Bell },
    { name: "Marquee Settings", path: "/admin/marquee", icon: Settings },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col w-64 border-r ${
        theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      } fixed inset-y-0`}>
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-bold text-xl">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.path) && "font-medium"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
            
            <li className="mt-6">
              <Link to="/logout">
                <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Admin Panel v1.0</span>
          <ThemeToggle />
        </div>
      </aside>
      
      {/* Mobile Header */}
      <header className={`md:hidden fixed top-0 left-0 right-0 h-16 border-b z-30 ${
        theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}>
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="p-4 border-b">
                  <Link to="/admin" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="font-bold text-xl">Admin Panel</span>
                  </Link>
                </div>
                
                <nav className="p-2">
                  <ul className="space-y-1">
                    {menuItems.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                          <Button
                            variant={isActive(item.path) ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              isActive(item.path) && "font-medium"
                            )}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                            <ChevronRight className="ml-auto h-4 w-4" />
                          </Button>
                        </Link>
                      </li>
                    ))}
                    
                    <li className="mt-6">
                      <Link to="/logout" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </Link>
                    </li>
                  </ul>
                </nav>
                
                <div className="p-4 border-t mt-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Admin Panel v1.0</span>
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/admin" className="ml-4">
              <span className="font-bold">Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}