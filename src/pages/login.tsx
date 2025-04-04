import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api } from "@/lib/api";
import { MainLayout } from "@/components/layout/MainLayout";
import { useThemeStore } from "@/lib/theme";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackButton } from "@/components/ui/back-button";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  const { theme } = useThemeStore();

  // Check if account is locked
  useEffect(() => {
    const lockedUntil = localStorage.getItem('accountLockedUntil');
    const attempts = localStorage.getItem('loginAttempts');
    
    if (lockedUntil) {
      const lockTime = new Date(lockedUntil);
      if (lockTime > new Date()) {
        setIsLocked(true);
        setLockoutTime(lockTime);
      } else {
        localStorage.removeItem('accountLockedUntil');
        localStorage.removeItem('loginAttempts');
      }
    }
    
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!isLocked || !lockoutTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((lockoutTime.getTime() - now.getTime()) / 1000));
      
      setTimeRemaining(diff);
      
      if (diff === 0) {
        setIsLocked(false);
        localStorage.removeItem('accountLockedUntil');
        localStorage.removeItem('loginAttempts');
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLocked, lockoutTime]);

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
      newErrors.email = "البريد الإلكتروني مطلوب";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) return;
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll simulate a successful login with email "admin@example.com" and password "password"
      const isValidCredentials = formData.email === "admin@example.com" && formData.password === "password";
      
      if (!isValidCredentials) {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('loginAttempts', newAttempts.toString());
        
        // Check if account should be locked
        if (newAttempts >= 5) {
          const lockoutDuration = 5 * 60 * 1000; // 5 minutes
          const lockoutEndTime = new Date(Date.now() + lockoutDuration);
          
          setIsLocked(true);
          setLockoutTime(lockoutEndTime);
          localStorage.setItem('accountLockedUntil', lockoutEndTime.toISOString());
          
          throw new Error("تم تجاوز الحد المسموح من المحاولات. تم قفل الحساب لمدة 5 دقائق.");
        }
        
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      
      // Log successful login
      const loginLog = {
        userId: "user123", // In a real app, this would be the actual user ID
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.1", // In a real app, this would be the actual IP
        userAgent: navigator.userAgent,
        success: true,
        failureReason: null
      };
      
      // In a real app, you would save this to the database
      // await fine.table("login_logs").insert(loginLog);
      
      // Reset login attempts on successful login
      localStorage.removeItem('loginAttempts');
      setLoginAttempts(0);
      
      // Mock user data
      const mockUser = {
        id: "user123",
        name: "مستخدم تجريبي",
        email: formData.email,
        role: formData.email === "admin@example.com" ? "admin" : "user"
      };
      
      // Set session expiration based on remember me
      const expirationDays = formData.rememberMe ? 30 : 1; // 30 days or 1 day
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);
      
      // Save to local storage for persistence
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      login(mockUser, "mock-token");
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${mockUser.name}!`,
      });
      
      // Redirect based on user role
      if (mockUser.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      // Log failed login
      const loginLog = {
        userId: "unknown", // In a real app, this might be null or the user ID if found
        timestamp: new Date().toISOString(),
        ipAddress: "192.168.1.1", // In a real app, this would be the actual IP
        userAgent: navigator.userAgent,
        success: false,
        failureReason: error.message
      };
      
      // In a real app, you would save this to the database
      // await fine.table("login_logs").insert(loginLog);
      
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email if available
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto flex min-h-[80vh] items-center justify-center py-10 px-4">
        <Card className={`mx-auto w-full max-w-md border ${
          theme === 'dark' 
            ? 'border-blue-800 bg-blue-950/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
            : 'border-blue-200 bg-blue-50/50'
        } transition-all duration-300`}>
          <CardHeader className="text-center relative">
            <div className="absolute right-4 top-4">
              <BackButton to="/" />
            </div>
            <CardTitle className={`text-3xl font-bold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-lg">
              أدخل بيانات الدخول الخاصة بك
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} dir="rtl">
            <CardContent className="space-y-6">
              {isLocked && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    تم قفل الحساب مؤقتاً بسبب محاولات فاشلة متكررة. يرجى المحاولة مرة أخرى بعد {formatTimeRemaining(timeRemaining)}.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading || isLocked}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                />
                {errors.email && <p className="text-sm text-destructive text-right">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading || isLocked}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                />
                {errors.password && <p className="text-sm text-destructive text-right">{errors.password}</p>}
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="rememberMe" 
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  disabled={isLoading || isLocked}
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm cursor-pointer select-none"
                >
                  تذكرني
                </Label>
              </div>
              
              <div className="text-sm text-right">
                <p className="text-muted-foreground">
                  للتجربة، استخدم: admin@example.com / password
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className={`w-full h-11 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.8)]'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-all duration-300`}
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                ليس لديك حساب؟{" "}
                <Link 
                  to="/signup" 
                  className={`${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  } underline underline-offset-4 hover:text-primary/90`}
                >
                  إنشاء حساب
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
}