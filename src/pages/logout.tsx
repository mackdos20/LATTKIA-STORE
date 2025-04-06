import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";

export default function Logout() {
  const { logout } = useAuthStore();
  const { toast } = useToast();
  
  useEffect(() => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  }, [logout, toast]);
  
  return <Navigate to="/" />;
}