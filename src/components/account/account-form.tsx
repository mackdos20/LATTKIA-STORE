import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useThemeStore } from "@/lib/theme";

export function AccountForm() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { theme } = useThemeStore();

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "الاسم مطلوب";
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = "كلمة المرور الحالية مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // In a real app, you would call an API to update the user
      // For demo purposes, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in state
      if (user) {
        updateUser({
          ...user,
          name: formData.name,
        });
      }
      
      toast({
        title: "تم تحديث الحساب",
        description: "تم تحديث معلومات حسابك بنجاح",
      });
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث الحساب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`w-full border ${
      theme === 'dark' 
        ? 'border-blue-800 bg-blue-950/30' 
        : 'border-blue-200 bg-blue-50/50'
    }`}>
      <CardHeader>
        <CardTitle className={`text-xl ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>
          معلومات الحساب
        </CardTitle>
        <CardDescription>
          تعديل معلومات حسابك الشخصية
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} dir="rtl">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right block">الاسم</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={`${
                theme === 'dark' 
                  ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                  : 'bg-white border-blue-200 focus:border-blue-400'
              } text-right h-11`}
            />
            {errors.name && <p className="text-sm text-destructive text-right">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled={true}
              className={`${
                theme === 'dark' 
                  ? 'bg-blue-900/50 border-blue-700 text-blue-300' 
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              } text-right h-11`}
            />
            <p className="text-xs text-muted-foreground text-right">لا يمكن تغيير البريد الإلكتروني</p>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className={`text-lg font-medium mb-4 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              تغيير كلمة المرور
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-right block">كلمة المرور الحالية</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                />
                {errors.currentPassword && <p className="text-sm text-destructive text-right">{errors.currentPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-right block">كلمة المرور الجديدة</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                />
                {errors.newPassword && <p className="text-sm text-destructive text-right">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive text-right">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className={`w-full h-11 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.8)]'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-all duration-300`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}