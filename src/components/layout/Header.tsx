import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, Camera } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";

export function Header() {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="w-full border-b">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <Camera className="h-6 w-6" />
          <span>Photo Portfolio</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}