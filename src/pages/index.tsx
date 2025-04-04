import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fine } from "@/lib/fine";
import { User, LogOut, Settings } from "lucide-react";

const Index = () => {
  const { data: session } = fine.auth.useSession();

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">Photo Portfolio</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Showcase your photography with style
        </p>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Welcome{session?.user ? `, ${session.user.name}` : ""}</CardTitle>
            <CardDescription>
              {session?.user 
                ? "Manage your account or start creating your portfolio" 
                : "Sign in to manage your photo portfolio"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {session?.user ? (
              <>
                <Button asChild className="w-full h-11">
                  <Link to="/account">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-11">
                  <Link to="/logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full h-11">
                  <Link to="/login">
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full h-11">
                  <Link to="/signup">
                    Create Account
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Index;