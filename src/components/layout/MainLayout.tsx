import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ShoppingCart, User } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useThemeStore();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className={`py-4 px-6 ${theme === 'dark' ? 'bg-slate-900 border-b border-blue-900' : 'bg-white border-b border-gray-200'}`}>
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>Photo Portfolio</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={theme === 'dark' ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={theme === 'dark' ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'}
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className={theme === 'dark' ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' : 'text-blue-600 hover:text-blue-500 hover:bg-blue-50'}
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          {children}
        </main>
        
        {/* Footer */}
        <footer className={`py-8 px-6 ${theme === 'dark' ? 'bg-slate-900 border-t border-blue-900' : 'bg-gray-50 border-t border-gray-200'}`}>
          <div className="container mx-auto">
            <div className="text-center">
              <p className="text-muted-foreground">
                &copy; {new Date().getFullYear()} Photo Portfolio. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}