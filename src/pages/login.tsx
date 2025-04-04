import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if account is locked
    const lockedUntil = localStorage.getItem('accountLockedUntil');
    if (lockedUntil) {
      const lockTimeMs = parseInt(lockedUntil, 10);
      if (lockTimeMs > Date.now()) {
        setIsLocked(true);
        setLockTime(Math.ceil((lockTimeMs - Date.now()) / 1000));
        
        // Set timer to update countdown
        const timer = setInterval(() => {
          setLockTime(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              setIsLocked(false);
              localStorage.removeItem('accountLockedUntil');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('accountLockedUntil');
      }
    }
    
    // Get login attempts
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts, 10));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const logLoginAttempt = async (success: boolean, failureReason?: string) => {
    try {
      // Get IP address (in a real app, this would be done server-side)
      const ipAddress = "Client IP"; // Placeholder
      
      if (fine.auth.session?.user?.id) {
        await fine.table("login_logs").insert({
          userId: fine.auth.session.user.id,
          ipAddress,
          userAgent: navigator.userAgent,
          success,
          failureReason: failureReason || null
        });
      }
    } catch (error) {
      console.error("Failed to log login attempt:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${lockTime} seconds.`,
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await fine.auth.signIn.email(
        {
          email: formData.email,
          password: formData.password,
          callbackURL: "/",
          rememberMe: formData.rememberMe,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            // Reset login attempts on success
            localStorage.removeItem('loginAttempts');
            setLoginAttempts(0);
            
            // Log successful login
            logLoginAttempt(true);
            
            toast({
              title: "Success",
              description: "You have been signed in successfully.",
            });
            navigate("/");
          },
          onError: (ctx) => {
            // Increment login attempts
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            localStorage.setItem('loginAttempts', newAttempts.toString());
            
            // Log failed login
            logLoginAttempt(false, ctx.error.message);
            
            // Lock account after 5 failed attempts
            if (newAttempts >= 5) {
              const lockDuration = 5 * 60 * 1000; // 5 minutes
              const lockedUntil = Date.now() + lockDuration;
              localStorage.setItem('accountLockedUntil', lockedUntil.toString());
              setIsLocked(true);
              setLockTime(lockDuration / 1000);
              
              toast({
                title: "Account temporarily locked",
                description: "Too many failed attempts. Please try again in 5 minutes.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error",
                description: ctx.error.message,
                variant: "destructive",
              });
            }
          },
        }
      );

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!fine) return <Navigate to='/' />;
  const { isPending, data } = fine.auth.useSession();
  if (!isPending && data) return <Navigate to='/' />;

  return (
    <div className='container mx-auto flex min-h-screen items-center justify-center px-4 py-10'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader className="relative">
          <div className="absolute left-4 top-4">
            <BackButton to="/" />
          </div>
          <div className="pt-2">
            <CardTitle className='text-2xl'>Sign in</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            {isLocked && (
              <div className="rounded-lg bg-amber-50 p-4 text-amber-800 mb-4 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Account temporarily locked</p>
                  <p className="text-sm">Too many failed attempts. Please try again in {lockTime} seconds.</p>
                </div>
              </div>
            )}
            
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || isLocked}
                aria-invalid={!!errors.email}
                className="h-11"
              />
              {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Link to='/forgot-password' className='text-sm text-primary underline-offset-4 hover:underline'>
                  Forgot password?
                </Link>
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading || isLocked}
                aria-invalid={!!errors.password}
                className="h-11"
              />
              {errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox 
                id='rememberMe' 
                checked={formData.rememberMe} 
                onCheckedChange={handleCheckboxChange}
                disabled={isLoading || isLocked}
              />
              <Label htmlFor='rememberMe' className='text-sm font-normal'>
                Remember me for 30 days
              </Label>
            </div>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button 
              type='submit' 
              className='w-full h-11' 
              disabled={isLoading || isLocked}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className='text-center text-sm text-muted-foreground'>
              Don't have an account?{" "}
              <Link to='/signup' className='text-primary underline underline-offset-4 hover:text-primary/90'>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}