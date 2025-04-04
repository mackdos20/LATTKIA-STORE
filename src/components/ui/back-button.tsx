import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useThemeStore } from "@/lib/theme";

interface BackButtonProps {
  to?: string;
  className?: string;
}

export function BackButton({ to, className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`${
        theme === 'dark' 
          ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
          : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
      } ${className}`}
    >
      <ArrowRight className="h-4 w-4 ml-1" />
      <span>رجوع</span>
    </Button>
  );
}