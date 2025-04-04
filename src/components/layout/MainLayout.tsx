import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings,
  Sun,
  Moon,
  Home,
  Package,
  Phone
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/stores/cart-store";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    {
      title: "الرئيسية",
      icon: <Home className="h-5 w-5" />,
      link: "/",
    },
    {
      title: "المنتجات",
      icon: <Package className="h-5 w-5" />,
      link: "/categories",
    },
    {
      title: "طلباتي",
      icon: <ShoppingCart className="h-5 w-5" />,
      link: "/orders",
      authRequired: true,
    },
    {
      title: "حسابي",
      icon: <User className="h-5 w-5" />,
      link: "/account",
      authRequired: true,
    },
    {
      title: "تواصل معنا",
      icon: <Phone className="h-5 w-5" />,
      link: "/contact",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

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
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
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
                        متجر إكسسوارات الهواتف
                      </h2>
                      <Button variant="ghost" size="icon" onClick={closeMenu}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <Separator className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} />
                    <nav className="flex-1 overflow-y-auto py-4">
                      <ul className="space-y-1 px-2">
                        {menuItems
                          .filter(item => !item.authRequired || (item.authRequired && user))
                          .map((item, index) => (
                            <li key={index}>
                              <Link 
                                to={item.link} 
                                className={`flex items-center px-3 py-2 rounded-md text-sm ${
                                  theme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-800'
                                    : 'text-slate-700 hover:bg-slate-100'
                                }`}
                                onClick={closeMenu}
                              >
                                <span className="ml-3">{item.icon}</span>
                                <span>{item.title}</span>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </nav>
                    <Separator className={theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} />
                    <div className="p-4 space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={toggleTheme}
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="h-4 w-4 ml-2" />
                            الوضع النهاري
                          </>
                        ) : (
                          <>
                            <Moon className="h-4 w-4 ml-2" />
                            الوضع الليلي
                          </>
                        )}
                      </Button>
                      
                      {user ? (
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 ml-2" />
                          تسجيل الخروج
                        </Button>
                      ) : (
                        <Button 
                          className={`w-full ${
                            theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          onClick={() => {
                            navigate("/login");
                            closeMenu();
                          }}
                        >
                          <User className="h-4 w-4 ml-2" />
                          تسجيل الدخول
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Link to="/" className={`text-xl font-bold ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                متجر إكسسوارات الهواتف
              </Link>
            )}
          </div>
          
          {!isMobile && (
            <nav>
              <ul className="flex items-center space-x-6 space-x-reverse">
                {menuItems
                  .filter(item => !item.authRequired || (item.authRequired && user))
                  .map((item, index) => (
                    <li key={index}>
                      <Link 
                        to={item.link} 
                        className={`flex items-center ${
                          theme === 'dark'
                            ? 'text-slate-300 hover:text-blue-400'
                            : 'text-slate-700 hover:text-blue-600'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          )}
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className={theme === 'dark' ? 'text-yellow-400' : 'text-slate-700'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {!isMobile && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt={user.name || "المستخدم"} />
                        <AvatarFallback className={
                          theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'
                        }>
                          {user.name?.charAt(0) || "م"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || "المستخدم"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email || "user@example.com"}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/account")}>
                      <User className="ml-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <ShoppingCart className="ml-2 h-4 w-4" />
                      <span>طلباتي</span>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Settings className="ml-2 h-4 w-4" />
                        <span>لوحة التحكم</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                      <LogOut className="ml-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/login">
                  <Button 
                    className={`${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    تسجيل الدخول
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className={`flex-1 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className={`py-6 px-4 border-t ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-white border-slate-200'
      }`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                متجر إكسسوارات الهواتف
              </h3>
              <p className="text-muted-foreground">
                أفضل الإكسسوارات بأسعار الجملة لأصحاب المحلات
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                روابط سريعة
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:underline">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-muted-foreground hover:underline">
                    المنتجات
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:underline">
                    تواصل معنا
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                تواصل معنا
              </h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  البريد الإلكتروني: info@phoneaccessories.com
                </li>
                <li className="text-muted-foreground">
                  الهاتف: +966 12 345 6789
                </li>
                <li className="text-muted-foreground">
                  العنوان: الرياض، المملكة العربية السعودية
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} متجر إكسسوارات الهواتف. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}