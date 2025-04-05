import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";

export default function Logout() {
  useEffect(() => {
    const signOut = async () => {
      await fine.auth.signOut();
    };
    
    signOut();
  }, []);

  return <Navigate to="/" />;
}