import { ReactNode } from "react";
import { useThemeStore } from "@/lib/theme";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { getItemsCount } = useCartStore();
  const { user } = useAuthStore();
  
  const itemsCount = getItemsCount();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 ${theme === 'dark' ? 'bg-blue-950 border-b border-blue-900' : 'bg-blue-50 border-b border-blue-100'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className={`text-xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            متجر إكسسوارات الهواتف
          </Link>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className={`relative ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {user ? (
              <Link to="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className={`py-8 px-6 mt-12 ${theme === 'dark' ? 'bg-blue-950 border-t border-blue-900' : 'bg-blue-50 border-t border-blue-100'}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                متجر إكسسوارات الهواتف
              </h3>
              <p className="text-sm text-muted-foreground">
                أفضل الإكسسوارات بأسعار الجملة لأصحاب المحلات
              </p>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                روابط سريعة
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground hover:underline">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="text-muted-foreground hover:underline">
                    الفئات
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-muted-foreground hover:underline">
                    سلة التسوق
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-muted-foreground hover:underline">
                    حسابي
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                تواصل معنا
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">
                  البريد الإلكتروني: info@phoneaccessories.com
                </li>
                <li className="text-muted-foreground">
                  الهاتف: +123 456 7890
                </li>
                <li className="text-muted-foreground">
                  العنوان: شارع الرياض، المملكة العربية السعودية
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} متجر إكسسوارات الهواتف. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}