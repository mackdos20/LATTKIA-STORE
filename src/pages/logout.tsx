import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";

export default function Logout() {
  useEffect(() => {
    const performLogout = async () => {
      await fine.auth.signOut();
    };
    
    performLogout();
  }, []);

  return <Navigate to="/" />;
}