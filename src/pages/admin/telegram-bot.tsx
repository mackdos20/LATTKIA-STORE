import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeStore } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Bot, MessageSquare, Bell, Settings, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// نوع بيانات رسالة التلجرام
type TelegramMessage = {
  id: string;
  date: string;
  text: string;
  from: string;
  isReply: boolean;
};

// نوع بيانات إعدادات البوت
type BotSettings = {
  token: string;
  chatId: string;
  enabled: boolean;
  notifyNewOrders: boolean;
  notifyLowStock: boolean;
  notifyNewUsers: boolean;
  welcomeMessage: string;
  autoReply: boolean;
};

export default function AdminTelegramBot() {
  const { theme } = useThemeStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [messages, setMessages] = useState<TelegramMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [botSettings, setBotSettings] = useState<BotSettings>({
    token: "",
    chatId: "",
    enabled: false,
    notifyNewOrders: true,
    notifyLowStock: true,
    notifyNewUsers: false,
    welcomeMessage: "مرحباً بك في متجر إكسسوارات الهواتف! كيف يمكنني مساعدتك؟",
    autoReply: true,
  });
  const [botStatus, setBotStatus] = useState<"connected" | "disconnected" | "unknown">("unknown");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // في التطبيق الحقيقي، ستقوم بجلب البيانات من API
        // هنا نستخدم بيانات وهمية للعرض
        
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // بيانات وهمية للرسائل
        const mockMessages: TelegramMessage[] = [
          {
            id: "1",
            date: "2023-08-15T14:30:00",
            text: "مرحباً، هل يمكنني الاستفسار عن توفر كفرات آيفون 14؟",
            from: "Ahmed",
            isReply: false,
          },
          {
            id: "2",
            date: "2023-08-15T14:35:00",
            text: "نعم، لدينا كفرات متوفرة لآيفون 14 بعدة ألوان وتصاميم. هل تبحث عن نوع معين؟",
            from: "Bot",
            isReply: true,
          },
          {
            id: "3",
            date: "2023-08-15T14:40:00",
            text: "أبحث عن كفر شفاف مع حماية ضد الصدمات",
            from: "Ahmed",
            isReply: false,
          },
          {
            id: "4",
            date: "2023-08-15T14:45:00",
            text: "نعم، لدينا كفرات شفافة مضادة للصدمات من ماركة Spigen. السعر 25 دولار للقطعة، وهناك خصم 10% عند شراء 5 قطع أو أكثر.",
            from: "Bot",
            isReply: true,
          },
          {
            id: "5",
            date: "2023-08-16T10:15:00",
            text: "طلب جديد #1234 تم إنشاؤه بقيمة $350",
            from: "System",
            isReply: false,
          },
          {
            id: "6",
            date: "2023-08-17T09:30:00",
            text: "تنبيه: المخزون منخفض لمنتج 'شاحن سريع سامسونج' (متبقي 5 قطع)",
            from: "System",
            isReply: false,
          },
        ];
        
        // إعدادات وهمية للبوت
        const mockSettings: BotSettings = {
          token: "1234567890:ABCDefGhIJKLmnoPQRSTuvwxYZ123456789",
          chatId: "-1001234567890",
          enabled: true,
          notifyNewOrders: true,
          notifyLowStock: true,
          notifyNewUsers: false,
          welcomeMessage: "مرحباً بك في متجر إكسسوارات الهواتف! كيف يمكنني مساعدتك؟",
          autoReply: true,
        };
        
        setMessages(mockMessages);
        setBotSettings(mockSettings);
        setBotStatus("connected");
      } catch (error) {
        console.error("Error fetchingTelegram bot data:", error);
        setBotStatus("disconnected");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // محاكاة حفظ الإعدادات
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث إعدادات بوت التلجرام بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setIsSendingMessage(true);
    try {
      // محاكاة إرسال الرسالة
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // إضافة الرسالة إلى القائمة
      const newMsg: TelegramMessage = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        text: newMessage,
        from: "Admin",
        isReply: true,
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال الرسالة بنجاح إلى قناة التلجرام",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرسالة",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      // محاكاة اختبار الاتصال
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // نفترض أن الاتصال ناجح
      setBotStatus("connected");
      
      toast({
        title: "تم الاتصال بنجاح",
        description: "تم التحقق من اتصال بوت التلجرام بنجاح",
      });
    } catch (error) {
      setBotStatus("disconnected");
      
      toast({
        title: "فشل الاتصال",
        description: "تعذر الاتصال ببوت التلجرام. يرجى التحقق من التوكن ومعرف الدردشة",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-2xl md:text-3xl font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            <Bot className="inline-block mr-2 h-8 w-8" />
            إدارة بوت التلجرام
          </h1>
          
          <Badge 
            variant={botStatus === "connected" ? "default" : "destructive"}
            className={`text-sm py-1 px-3 ${
              botStatus === "connected" 
                ? 'bg-green-600' 
                : botStatus === "disconnected" 
                  ? 'bg-red-600' 
                  : 'bg-yellow-600'
            }`}
          >
            {botStatus === "connected" ? "متصل" : botStatus === "disconnected" ? "غير متصل" : "غير معروف"}
          </Badge>
        </div>
        
        <p className="text-muted-foreground mb-8">
          يمكنك من خلال هذه الصفحة إدارة بوت التلجرام الخاص بمتجرك، وإرسال الإشعارات والرسائل، ومتابعة الرسائل الواردة.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="messages"
                className={`text-base py-3 ${
                  theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
                }`}
              >
                <MessageSquare className="h-4 w-4 ml-2" />
                الرسائل
              </TabsTrigger>
              <TabsTrigger 
                value="notifications"
                className={`text-base py-3 ${
                  theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
                }`}
              >
                <Bell className="h-4 w-4 ml-2" />
                الإشعارات
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className={`text-base py-3 ${
                  theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
                }`}
              >
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </TabsTrigger>
            </TabsList>
            
            {/* علامة تبويب الرسائل */}
            <TabsContent value="messages" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* قائمة الرسائل */}
                <div className="md:col-span-2">
                  <Card className={`border ${
                    theme === 'dark' 
                      ? 'border-blue-800 bg-blue-950/30' 
                      : 'border-blue-200 bg-blue-50/50'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`text-xl ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        سجل الرسائل
                      </CardTitle>
                      <CardDescription>
                        آخر الرسائل المتبادلة عبر بوت التلجرام
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`rounded-md p-4 mb-4 ${
                        theme === 'dark' ? 'bg-slate-800' : 'bg-white'
                      } h-[400px] overflow-y-auto`}>
                        {messages.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                            <p>لا توجد رسائل حتى الآن</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.map((msg) => (
                              <div 
                                key={msg.id} 
                                className={`p-3 rounded-lg max-w-[80%] ${
                                  msg.isReply 
                                    ? 'mr-auto rounded-tr-none ' + (theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100')
                                    : 'ml-auto rounded-tl-none ' + (theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100')
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className={`font-medium text-sm ${
                                    msg.from === "System" 
                                      ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                                      : ''
                                  }`}>
                                    {msg.from}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(msg.date)}
                                  </span>
                                </div>
                                <p className="text-sm">{msg.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Textarea
                            placeholder="اكتب رسالة..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className={`resize-none ${
                              theme === 'dark' 
                                ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                                : 'bg-white border-blue-200 focus:border-blue-400'
                            }`}
                            rows={3}
                            dir="rtl"
                          />
                        </div>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={isSendingMessage || !newMessage.trim() || botStatus !== "connected"}
                          className={`h-11 ${
                            theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {isSendingMessage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 ml-2" />
                              إرسال
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* دليل استخدام البوت */}
                <div>
                  <Card className={`border ${
                    theme === 'dark' 
                      ? 'border-blue-800 bg-blue-950/30' 
                      : 'border-blue-200 bg-blue-50/50'
                  }`}>
                    <CardHeader>
                      <CardTitle className={`text-xl ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        دليل استخدام البوت
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">أوامر البوت الأساسية:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>/start - بدء استخدام البوت</li>
                          <li>/help - عرض قائمة المساعدة</li>
                          <li>/products - عرض المنتجات المتوفرة</li>
                          <li>/categories - عرض فئات المنتجات</li>
                          <li>/order - الاستعلام عن طلب</li>
                          <li>/contact - التواصل مع خدمة العملاء</li>
                        </ul>
                      </div>
                      
                      <Separator className={theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} />
                      
                      <div>
                        <h3 className="font-medium mb-2">أوامر المسؤول:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>/stats - عرض إحصائيات المتجر</li>
                          <li>/orders - عرض آخر الطلبات</li>
                          <li>/broadcast - إرسال رسالة لجميع المستخدمين</li>
                          <li>/stock - التحقق من المخزون</li>
                        </ul>
                      </div>
                      
                      <Separator className={theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} />
                      
                      <div>
                        <h3 className="font-medium mb-2">كيفية الإعداد:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>إنشاء بوت جديد عبر @BotFather</li>
                          <li>الحصول على توكن البوت</li>
                          <li>إنشاء قناة أو مجموعة</li>
                          <li>إضافة البوت كمسؤول</li>
                          <li>نسخ معرف القناة/المجموعة</li>
                          <li>إدخال التوكن والمعرف في الإعدادات</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* علامة تبويب الإشعارات */}
            <TabsContent value="notifications" className="mt-0">
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-blue-800 bg-blue-950/30' 
                  : 'border-blue-200 bg-blue-50/50'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    إعدادات الإشعارات
                  </CardTitle>
                  <CardDescription>
                    تخصيص الإشعارات التي يتم إرسالها تلقائياً عبربوت التلجرام
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifyNewOrders">إشعارات الطلبات الجديدة</Label>
                        <p className="text-sm text-muted-foreground">
                          إرسال إشعار عند إنشاء طلب جديد
                        </p>
                      </div>
                      <Switch
                        id="notifyNewOrders"
                        checked={botSettings.notifyNewOrders}
                        onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, notifyNewOrders: checked }))}
                      />
                    </div>
                    
                    <Separator className={theme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'} />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifyLowStock">إشعارات المخزون المنخفض</Label>
                        <p className="text-sm text-muted-foreground">
                          إرسال إشعار عندما ينخفض مخزون منتج عن الحد الأدنى
                        </p>
                      </div>
                      <Switch
                        id="notifyLowStock"
                        checked={botSettings.notifyLowStock}
                        onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, notifyLowStock: checked }))}
                      />
                    </div>
                    
                    <Separator className={theme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'} />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifyNewUsers">إشعارات المستخدمين الجدد</Label>
                        <p className="text-sm text-muted-foreground">
                          إرسال إشعار عند تسجيل مستخدم جديد
                        </p>
                      </div>
                      <Switch
                        id="notifyNewUsers"
                        checked={botSettings.notifyNewUsers}
                        onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, notifyNewUsers: checked }))}
                      />
                    </div>
                    
                    <Separator className={theme === 'dark' ? 'bg-blue-800/50' : 'bg-blue-100'} />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="autoReply">الرد التلقائي</Label>
                        <p className="text-sm text-muted-foreground">
                          تمكين الرد التلقائي على رسائل العملاء
                        </p>
                      </div>
                      <Switch
                        id="autoReply"
                        checked={botSettings.autoReply}
                        onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, autoReply: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Label htmlFor="welcomeMessage" className="mb-2 block">رسالة الترحيب</Label>
                    <Textarea
                      id="welcomeMessage"
                      value={botSettings.welcomeMessage}
                      onChange={(e) => setBotSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                      className={`resize-none ${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      }`}
                      rows={3}
                      dir="rtl"
                      placeholder="أدخل رسالة الترحيب التي سيتم إرسالها للمستخدمين الجدد"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">نماذج الإشعارات</h3>
                    
                    <div className="space-y-4">
                      <Card className={`border ${
                        theme === 'dark' 
                          ? 'border-green-800 bg-green-900/20' 
                          : 'border-green-200 bg-green-50'
                      }`}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">نموذج إشعار طلب جديد</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 text-sm">
                          <p dir="rtl">🛍️ <strong>طلب جديد #1234</strong></p>
                          <p dir="rtl">العميل: أحمد محمد</p>
                          <p dir="rtl">المبلغ: $350</p>
                          <p dir="rtl">المنتجات: 5 عناصر</p>
                          <p dir="rtl">التاريخ: 15 أغسطس 2023</p>
                          <p dir="rtl">الحالة: بانتظار الدفع</p>
                        </CardContent>
                      </Card>
                      
                      <Card className={`border ${
                        theme === 'dark' 
                          ? 'border-yellow-800 bg-yellow-900/20' 
                          : 'border-yellow-200 bg-yellow-50'
                      }`}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">نموذج إشعار مخزون منخفض</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 text-sm">
                          <p dir="rtl">⚠️ <strong>تنبيه: مخزون منخفض</strong></p>
                          <p dir="rtl">المنتج: شاحن سريع سامسونج</p>
                          <p dir="rtl">الكمية المتبقية: 5 قطع</p>
                          <p dir="rtl">الحد الأدنى: 10 قطع</p>
                          <p dir="rtl">رمز المنتج: CH-SAM-001</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={`w-full h-11 ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      "حفظ إعدادات الإشعارات"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* علامة تبويب الإعدادات */}
            <TabsContent value="settings" className="mt-0">
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-blue-800 bg-blue-950/30' 
                  : 'border-blue-200 bg-blue-50/50'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    إعدادات البوت
                  </CardTitle>
                  <CardDescription>
                    إعداد وتكوين بوت التلجرام الخاص بالمتجر
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="botToken">توكن البوت (Bot Token)</Label>
                      <Input
                        id="botToken"
                        type="password"
                        value={botSettings.token}
                        onChange={(e) => setBotSettings(prev => ({ ...prev, token: e.target.value }))}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                            : 'bg-white border-blue-200 focus:border-blue-400'
                        } h-11`}
                        placeholder="أدخل توكن البوت الذي حصلت عليه من BotFather"
                        dir="ltr"
                      />
                      <p className="text-xs text-muted-foreground">
                        يمكنك الحصول على توكن البوت من خلال التحدث مع @BotFather على تلجرام
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="chatId">معرف الدردشة (Chat ID)</Label>
                      <Input
                        id="chatId"
                        value={botSettings.chatId}
                        onChange={(e) => setBotSettings(prev => ({ ...prev, chatId: e.target.value }))}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                            : 'bg-white border-blue-200 focus:border-blue-400'
                        } h-11`}
                        placeholder="أدخل معرف المجموعة أو القناة (مثال: -1001234567890)"
                        dir="ltr"
                      />
                      <p className="text-xs text-muted-foreground">
                        معرف المجموعة أو القناة التي سيتم إرسال الإشعارات إليها
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableBot">تفعيل البوت</Label>
                        <p className="text-sm text-muted-foreground">
                          تمكين أو تعطيل بوت التلجرام
                        </p>
                      </div>
                      <Switch
                        id="enableBot"
                        checked={botSettings.enabled}
                        onCheckedChange={(checked) => setBotSettings(prev => ({ ...prev, enabled: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">حالة الاتصال</h3>
                    
                    <div className={`p-4 rounded-md ${
                      botStatus === "connected" 
                        ? theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
                        : botStatus === "disconnected"
                          ? theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                          : theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <div className="flex items-center">
                        {botStatus === "connected" ? (
                          <CheckCircle2 className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                        ) : botStatus === "disconnected" ? (
                          <XCircle className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                        ) : (
                          <RefreshCw className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        )}
                        
                        <div>
                          <p className="font-medium">
                            {botStatus === "connected" 
                              ? "البوت متصل ويعمل بشكل صحيح" 
                              : botStatus === "disconnected" 
                                ? "البوت غير متصل" 
                                : "حالة الاتصال غير معروفة"
                            }
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {botStatus === "connected" 
                              ? "آخر تحديث: منذ 5 دقائق" 
                              : botStatus === "disconnected" 
                                ? "يرجى التحقق من التوكن ومعرف الدردشة" 
                                : "جاري التحقق من حالة الاتصال..."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={handleTestConnection}
                        disabled={isTestingConnection || !botSettings.token || !botSettings.chatId}
                        variant="outline"
                        className={`h-11 ${
                          theme === 'dark'
                            ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30'
                            : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {isTestingConnection ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري اختبار الاتصال...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="ml-2 h-4 w-4" />
                            اختبار الاتصال
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">إحصائيات البوت</h3>
                    
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">عدد المستخدمين النشطين</TableCell>
                          <TableCell>127</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">عدد الرسائل المستلمة</TableCell>
                          <TableCell>1,542</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">عدد الرسائل المرسلة</TableCell>
                          <TableCell>2,318</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">عدد الإشعارات المرسلة</TableCell>
                          <TableCell>856</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">تاريخ آخر نشاط</TableCell>
                          <TableCell>منذ 5 دقائق</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={`w-full h-11 ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      "حفظ إعدادات البوت"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}