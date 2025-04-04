import { fine } from "@/lib/fine";
import { ProtectedRoute } from "@/components/auth/route-components";
import { BackButton } from "@/components/ui/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountForm } from "@/components/account/account-form";
import { LoginLogTable } from "@/components/account/login-log-table";
import { useIsMobile } from "@/hooks/use-mobile";

function AccountPage() {
  const isMobile = useIsMobile();
  const { data: session } = fine.auth.useSession();

  return (
    <main className="w-full min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6 max-w-5xl">
        <div className="flex items-center mb-6">
          <BackButton to="/" />
          <h1 className="text-2xl font-bold ml-2">Account Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <AccountForm />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <LoginLogTable />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function AccountPageWrapper() {
  return <ProtectedRoute Component={AccountPage} />;
}