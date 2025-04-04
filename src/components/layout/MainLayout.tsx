import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { ShoppingCart, User, Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const {theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-50 w-full border-b ${
        theme === 'dark' 
          ? 'bg-slate-900 border-blue-900' 
          : 'bg-white border-blue-100'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              متجر الإكسسوارات
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link to="/" className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
            }`}>
              الرئيسية
            </Link>
            <Link to="/categories" className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
            }`}>
              الفئات
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMobileMenu}
              className={`p-1 ${
                theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className={`p-1 ${
                theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            {/* Cart */}
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-1 relative ${
                  theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                }`}
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* User */}
            {user ? (
              <Link to="/account">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-1 ${
                    theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                  }`}
                >
                  <User size={20} />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button 
                  size="sm" 
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${
            theme === 'dark' ? 'bg-slate-900' : 'bg-white'
          } border-t ${
            theme === 'dark' ? 'border-blue-900' : 'border-blue-100'
          }`}>
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-base font-medium ${
                  theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                to="/categories" 
                className={`text-base font-medium ${
                  theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                الفئات
              </Link>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4 space-x-reverse">
                  {/* Theme Toggle */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleTheme}
                    className={`p-1 ${
                      theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                    }`}
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span className="mr-2">
                      {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                    </span>
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 space-x-reverse">
                  {/* Cart */}
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`p-1 relative ${
                        theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                      }`}
                    >
                      <ShoppingCart size={20} />
                      <span className="mr-2">السلة</span>
                      {cartItemsCount > 0 && (
                        <span className="absolute top-0 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                  
                  {/* User */}
                  {user ? (
                    <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`p-1 ${
                          theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-blue-700 hover:text-blue-800'
                        }`}
                      >
                        <User size={20} />
                        <span className="mr-2">حسابي</span>
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        size="sm" 
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        تسجيل الدخول
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className={`border-t py-6 ${
        theme === 'dark' 
          ? 'bg-slate-900 border-blue-900 text-blue-300' 
          : 'bg-white border-blue-100 text-blue-700'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            جميع الحقوق محفوظة © {new Date().getFullYear()} متجر إكسسوارات الهواتف بالجملة
          </p>
        </div>
      </footer>
    </div>
  );
}