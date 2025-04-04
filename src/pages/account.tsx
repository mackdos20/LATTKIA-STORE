import { MainLayout } from "@/components/layout/MainLayout";
import { AccountForm } from "@/components/account/account-form";
import { LoginLogTable } from "@/components/account/login-log-table";
import { BackButton } from "@/components/ui/back-button";
import { useThemeStore } from "@/lib/theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AccountPage() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <BackButton to="/" className="ml-4" />
          <h1 className={`text-2xl md:text-3xl font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            إدارة الحساب
          </h1>
        </div>

        <Tabs 
          defaultValue="profile" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="profile"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              سجل الدخول
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <AccountForm />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <LoginLogTable />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}