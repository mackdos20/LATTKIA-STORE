import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bot, Save, Check, MessageSquare, Bell, Settings, HelpCircle } from "lucide-react";
import { z } from "zod";

// Validation schemas
const tokenSchema = z.string().min(1, "يجب إدخال توكن البوت").regex(/^\d+:[A-Za-z0-9_-]+$/, "توكن البوت غير صالح");
const groupIdSchema = z.string().min(1, "يجب إدخال معرف المجموعة").regex(/^-?\d+$/, "معرف المجموعة غير صالح");
const messageSchema = z.string().min(1, "يجب إدخال نص الرسالة").max(1000, "الرسالة طويلة جداً");

const TelegramBot = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("settings");
  const [token, setToken] = useState('');
  const [groupId, setGroupId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [errors, setErrors] = useState({
    token: '',
    groupId: '',
    messages: {
      welcome: '',
      orderReceived: '',
      orderShipped: '',
      orderDelivered: ''
    }
  });
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    newUsers: true,
    orderUpdates: true
  });
  const [messages, setMessages] = useState({
    welcome: "مرحباً بك في متجر لاتكيا!",
    orderReceived: "تم استلام طلبك بنجاح!",
    orderShipped: "تم شحن طلبك!",
    orderDelivered: "تم تسليم طلبك!"
  });
  
  useEffect(() => {
    // Load saved settings from localStorage
    const savedToken = localStorage.getItem('telegramToken');
    const savedGroupId = localStorage.getItem('telegramGroupId');
    const savedNotifications = localStorage.getItem('telegramNotifications');
    const savedMessages = localStorage.getItem('telegramMessages');
    
    if (savedToken) setToken(savedToken);
    if (savedGroupId) setGroupId(savedGroupId);
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);
  
  const validateInputs = useCallback(() => {
    const newErrors = {
      token: '',
      groupId: '',
      messages: {
        welcome: '',
        orderReceived: '',
        orderShipped: '',
        orderDelivered: ''
      }
    };
    
    try {
      tokenSchema.parse(token);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.token = error.errors[0].message;
      }
    }
    
    try {
      groupIdSchema.parse(groupId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.groupId = error.errors[0].message;
      }
    }
    
    try {
      messageSchema.parse(messages.welcome);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.messages.welcome = error.errors[0].message;
      }
    }
    
    try {
      messageSchema.parse(messages.orderReceived);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.messages.orderReceived = error.errors[0].message;
      }
    }
    
    try {
      messageSchema.parse(messages.orderShipped);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.messages.orderShipped = error.errors[0].message;
      }
    }
    
    try {
      messageSchema.parse(messages.orderDelivered);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.messages.orderDelivered = error.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error) && 
           Object.values(newErrors.messages).every(error => !error);
  }, [token, groupId, messages]);
  
  const handleSaveSettings = async () => {
    if (!validateInputs()) {
      toast({
        title: "خطأ",
        description: "يرجى تصحيح الأخطاء قبل الحفظ",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Save settings to localStorage
      localStorage.setItem('telegramToken', token);
      localStorage.setItem('telegramGroupId', groupId);
      localStorage.setItem('telegramNotifications', JSON.stringify(notifications));
      localStorage.setItem('telegramMessages', JSON.stringify(messages));
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات البوت بنجاح",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const testConnection = async () => {
    if (!validateInputs()) {
      toast({
        title: "خطأ",
        description: "يرجى تصحيح الأخطاء قبل الاختبار",
        variant: "destructive",
      });
      return;
    }
    
    setIsTesting(true);
    try {
      // Test connection by sending a test message
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: groupId,
          text: 'Test message from LATTKIA STORE',
        }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        toast({
          title: "تم الاتصال",
          description: "تم الاتصال ببوت تيليجرام بنجاح",
        });
      } else {
        throw new Error(data.description || 'Unknown error');
      }
    } catch (error: any) {
      console.error('Error testing connection:', error);
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
          إعدادات بوت تيليجرام
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              الإشعارات
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              الرسائل
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    إعدادات البوت
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6" dir="rtl">
                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-right block">توكن البوت (Bot Token)</Label>
                    <Input
                      id="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="أدخل توكن البوت الذي حصلت عليه من BotFather"
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right ${errors.token ? 'border-red-500' : ''}`}
                    />
                    {errors.token && (
                      <p className="text-sm text-red-500">{errors.token}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      يمكنك الحصول على توكن البوت من خلال التحدث مع @BotFather في تيليجرام.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupId" className="text-right block">معرف المجموعة (Group ID)</Label>
                    <Input
                      id="groupId"
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      placeholder="أدخل معرف المجموعة التي سيرسل إليها البوت الإشعارات"
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right ${errors.groupId ? 'border-red-500' : ''}`}
                    />
                    {errors.groupId && (
                      <p className="text-sm text-red-500">{errors.groupId}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      يمكنك الحصول على معرف المجموعة من خلال إضافة @RawDataBot إلى المجموعة.
                    </p>
                  </div>
                  
                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      onClick={testConnection}
                      disabled={isTesting || !token || !groupId}
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
                      ) : (
                        "اختبار الاتصال"
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={isSaving || !token || !groupId}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    إعدادات الإشعارات
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6" dir="rtl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الطلبات الجديدة</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند استلام طلب جديد
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newOrders}
                      onCheckedChange={(checked) => setNotifications({...notifications, newOrders: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات المخزون المنخفض</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عندما يكون المخزون منخفضاً
                      </p>
                    </div>
                    <Switch
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) => setNotifications({...notifications, lowStock: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات المستخدمين الجدد</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند تسجيل مستخدم جديد
                      </p>
                    </div>
                    <Switch
                      checked={notifications.newUsers}
                      onCheckedChange={(checked) => setNotifications({...notifications, newUsers: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات تحديثات الطلبات</Label>
                      <p className="text-sm text-muted-foreground">
                        إرسال إشعار عند تحديث حالة الطلب
                      </p>
                    </div>
                    <Switch
                      checked={notifications.orderUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, orderUpdates: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    قوالب الرسائل
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6" dir="rtl">
                  <div className="space-y-2">
                    <Label htmlFor="welcome" className="text-right block">رسالة الترحيب</Label>
                    <Input
                      id="welcome"
                      value={messages.welcome}
                      onChange={(e) => setMessages({...messages, welcome: e.target.value})}
                      placeholder="رسالة الترحيب بالمستخدمين الجدد"
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right ${errors.messages.welcome ? 'border-red-500' : ''}`}
                    />
                    {errors.messages.welcome && (
                      <p className="text-sm text-red-500">{errors.messages.welcome}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderReceived" className="text-right block">رسالة استلام الطلب</Label>
                    <Input
                      id="orderReceived"
                      value={messages.orderReceived}
                      onChange={(e) => setMessages({...messages, orderReceived: e.target.value})}
                      placeholder="رسالة تأكيد استلام الطلب"
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right ${errors.messages.orderReceived ? 'border-red-500' : ''}`}
                    />
                    {errors.messages.orderReceived && (
                      <p className="text-sm text-red-500">{errors.messages.orderReceived}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderShipped" className="text-right block">رسالة شحن الطلب</Label>
                    <Input
                      id="orderShipped"
                      value={messages.orderShipped}
                      onChange={(e) => setMessages({...messages, orderShipped: e.target.value})}
                      placeholder="رسالة تأكيد شحن الطلب"
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right ${errors.messages.orderShipped ? 'border-red-500' : ''}`}
                    />
                    {errors.messages.orderShipped && (
                      <p className="text-sm text-red-500">{errors.messages.orderShipped}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderDelivered" className="text-right block">رسالة تسليم الطلب</Label>
                    <Input
                      id="orderDelivered"
                      value={messages.orderDelivered}
                      onChange={(e) => setMessages({...messages, orderDelivered: e.target.value})}
                      placeholder="رسالة تأكيد تسليم الطلب"
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right ${errors.messages.orderDelivered ? 'border-red-500' : ''}`}
                    />
                    {errors.messages.orderDelivered && (
                      <p className="text-sm text-red-500">{errors.messages.orderDelivered}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className={`p-4 rounded-lg mt-6 ${
          theme === 'dark' 
            ? 'bg-blue-900/20 text-blue-300' 
            : 'bg-blue-50 text-blue-700'
        }`}>
          <h3 className="font-bold mb-2 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            دليل استخدام البوت
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2">الأوامر الأساسية:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>/start - بدء استخدام البوت</li>
                <li>/help - عرض قائمة الأوامر</li>
                <li>/status - عرض حالة الطلبات</li>
                <li>/track [رقم الطلب] - تتبع حالة طلب معين</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2">أوامر المسؤول:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>/stats - عرض إحصائيات المتجر</li>
                <li>/orders - عرض قائمة الطلبات</li>
                <li>/users - عرض قائمة المستخدمين</li>
                <li>/notify [الرسالة] - إرسال إشعار لجميع المستخدمين</li>
              </ul>
            </div>
            
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <h4 className="font-bold text-yellow-500 mb-2">ملاحظات مهمة:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>تأكد من أن البوت عضو في المجموعة.</li>
                <li>تأكد من أن البوت لديه صلاحيات إرسال الرسائل.</li>
                <li>معرف المجموعة يجب أن يكون رقماً سالباً.</li>
                <li>إذا فشل الاتصال، تأكد من صحة التوكن ومعرف المجموعة.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TelegramBot; 