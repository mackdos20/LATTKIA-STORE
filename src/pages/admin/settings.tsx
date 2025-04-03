import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Save, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// نفترض أن هذه الإعدادات ستكون مخزنة في مكان ما (في الحالة الحقيقية ستكون في قاعدة البيانات)
const defaultSettings = {
  telegramBot: {
    token: "",
    username: "",
    groupId: "",
    isConnected: false
  }
};

const AdminSettings = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState("telegram");
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // في الحالة الحقيقية، سنقوم بجلب الإعدادات من الخادم
        // لكن هنا سنستخدم localStorage للمحاكاة
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleInputChange = (section: string, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // في الحالة الحقيقية، سنقوم بإرسال الإعدادات إلى الخادم
      // لكن هنا سنستخدم localStorage للمحاكاة
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const testTelegramConnection = async () => {
    setIsTesting(true);
    
    try {
      // في الحالة الحقيقية، سنقوم باختبار الاتصال بالبوت
      // لكن هنا سنقوم بمحاكاة نجاح الاتصال بعد تأخير قصير
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تحديث حالة الاتصال
      setSettings(prev => ({
        ...prev,
        telegramBot: {
          ...prev.telegramBot,
          isConnected: true
        }
      }));
      
      toast({
        title: "تم الاتصال",
        description: "تم الاتصال ببوت تيليجرام بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء الاتصال ببوت تيليجرام",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          إعدادات النظام
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="telegram" className="flex-1">إعدادات بوت تيليجرام</TabsTrigger>
            <TabsTrigger value="general" className="flex-1">إعدادات عامة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="telegram" className="mt-6">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    إعدادات بوت تيليجرام
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6" dir="rtl">
                    <div className="space-y-2">
                      <Label htmlFor="botToken" className="text-right block">توكن البوت (Bot Token)</Label>
                      <Input
                        id="botToken"
                        value={settings.telegramBot.token}
                        onChange={(e) => handleInputChange('telegramBot', 'token', e.target.value)}
                        placeholder="أدخل توكن البوت الذي حصلت عليه من BotFather"
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                            : 'bg-white border-blue-200 focus:border-blue-400'
                        } text-right`}
                      />
                      <p className="text-xs text-muted-foreground">
                        يمكنك الحصول على توكن البوت من خلال التحدث مع @BotFather في تيليجرام.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="botUsername" className="text-right block">اسم مستخدم البوت (Bot Username)</Label>
                      <Input
                        id="botUsername"
                        value={settings.telegramBot.username}
                        onChange={(e) => handleInputChange('telegramBot', 'username', e.target.value)}
                        placeholder="مثال: @YourBotName"
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                            : 'bg-white border-blue-200 focus:border-blue-400'
                        } text-right`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="groupId" className="text-right block">معرف المجموعة (Group ID)</Label>
                      <Input
                        id="groupId"
                        value={settings.telegramBot.groupId}
                        onChange={(e) => handleInputChange('telegramBot', 'groupId', e.target.value)}
                        placeholder="أدخل معرف المجموعة التي سيرسل إليها البوت الإشعارات"
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                            : 'bg-white border-blue-200 focus:border-blue-400'
                        } text-right`}
                      />
                      <p className="text-xs text-muted-foreground">
                        يمكنك الحصول على معرف المجموعة من خلال إضافة @RawDataBot إلى المجموعة.
                      </p>
                    </div>
                    
                    <div className="flex gap-4 justify-end">
                      <Button
                        type="button"
                        onClick={testTelegramConnection}
                        disabled={isTesting || !settings.telegramBot.token}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(22,163,74,0.5)] hover:shadow-[0_0_20px_rgba(22,163,74,0.7)]' 
                            : 'bg-green-600 hover:bg-green-700'
                        } transition-all duration-300`}
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الاختبار...
                          </>
                        ) : settings.telegramBot.isConnected ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            متصل
                          </>
                        ) : (
                          "اختبار الاتصال"
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={saveSettings}
                        disabled={isSaving}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } transition-all duration-300`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            حفظ الإعدادات
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className={`p-4 rounded-lg mt-6 ${
                      theme === 'dark' 
                        ? 'bg-blue-900/20 text-blue-300' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      <h3 className="font-bold mb-2">كيفية إعداد بوت تيليجرام:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>افتح تيليجرام وابحث عن @BotFather.</li>
                        <li>أرسل الأمر /newbot واتبع التعليمات لإنشاء بوت جديد.</li>
                        <li>ستحصل على توكن البوت، قم بنسخه ولصقه في الحقل أعلاه.</li>
                        <li>أضف البوت إلى المجموعة التي تريد إرسال الإشعارات إليها.</li>
                        <li>أضف @RawDataBot إلى المجموعة للحصول على معرف المجموعة.</li>
                        <li>انسخ معرف المجموعة والصقه في الحقل أعلاه.</li>
                        <li>اضغط على "اختبار الاتصال" للتأكد من أن البوت يعمل بشكل صحيح.</li>
                      </ol>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  إعدادات عامة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  سيتم إضافة المزيد من الإعدادات العامة في المستقبل.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminSettings;