import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { fine } from "@/lib/fine";

export default function Logout() {
  const { toast } = useToast();
  
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fine.auth.signOut();
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
    
    handleLogout();
  }, [toast]);
  
  return <Navigate to="/" />;
}