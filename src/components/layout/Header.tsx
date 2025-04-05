import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./theme-provider";
import { Camera } from "lucide-react";

export function Header() {
  const { theme } = useTheme();
  
  return (
    <header className={`w-full border-b ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          <span className="font-bold text-xl">Photo Portfolio</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm font-medium hover:underline">
              Gallery
            </Link>
            <Link to="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </nav>
          
          <ThemeToggle />
          
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}