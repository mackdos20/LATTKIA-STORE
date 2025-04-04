import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThemeStore } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, CheckCircle2, Send, Bot, Bell } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TelegramBotSettings() {
  const { theme } = useThemeStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [botSettings, setBotSettings] = useState({
    botToken: "",
    chatId: "",
    welcomeMessage: "مرحباً بك في بوت متجر إكسسوارات الهواتف! يمكنك استخدام هذا البوت للاستفسار عن المنتجات وتتبع طلباتك.",
    notifyNewOrders: true,
    notifyLowStock: true,
    notifyNewUsers: true,
    lowStockThreshold: "5",
    orderStatusTemplate: "تم تحديث حالة طلبك رقم {{orderNumber}} إلى: {{status}}",
    newOrderTemplate: "طلب جديد! \\nرقم الطلب: {{orderNumber}} \\nالعميل: {{customerName}} \\nالإجمالي: {{total}}",
  });
  const [testMessage, setTestMessage] = useState("");
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [recentMessages, setRecentMessages] = useState<{ id: number; date: string; text: string; direction: 'in' | 'out' }[]>([]);

  useEffect(() => {
    const fetchBotSettings = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this data from your API
        // const settings = await api.getTelegramBotSettings();
        
        // For demo purposes, we'll use mock data
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockSettings = {
          botToken: "1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi",
          chatId: "-1001234567890",
          welcomeMessage: "مرحباً بك في بوت متجر إكسسوارات الهواتف! يمكنك استخدام هذا البوت للاستفسار عن المنتجات وتتبع طلباتك.",
          notifyNewOrders: true,
          notifyLowStock: true,
          notifyNewUsers: true,
          lowStockThreshold: "5",
          orderStatusTemplate: "تم تحديث حالة طلبك رقم {{orderNumber}} إلى: {{status}}",
          newOrderTemplate: "طلب جديد! \\nرقم الطلب: {{orderNumber}} \\nالعميل: {{customerName}} \\nالإجمالي: {{total}}",
        };
        
        setBotSettings(mockSettings);
        setIsEnabled(true);
        
        // Mock recent messages
        const mockMessages = [
          { id: 1, date: "2023-06-15 14:30:22", text: "مرحباً، كيف يمكنني مساعدتك؟", direction: 'out' as const },
          { id: 2, date: "2023-06-15 14:31:05", text: "أريد الاستفسار عن شاحن سامسونج السريع", direction: 'in' as const },
          { id: 3, date: "2023-06-15 14:31:45", text: "شاحن سامسونج السريع متوفر بسعر $25. هل ترغب في معرفة المزيد؟", direction: 'out' as const },
          { id: 4, date: "2023-06-15 14:32:30", text: "نعم، ما هي المواصفات؟", direction: 'in' as const },
          { id: 5, date: "2023-06-15 14:33:15", text: "شاحن سامسونج السريع يدعم الشحن بقوة 25 واط، متوافق مع جميع هواتف سامسونج الحديثة. يأتي مع كابل USB-C.", direction: 'out' as const },
        ];
        
        setRecentMessages(mockMessages);
        
      } catch (error) {
        console.error("Error fetching Telegram bot settings:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب إعدادات بوت التلغرام",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBotSettings();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBotSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setBotSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBotSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would save this data to your API
      // await api.saveTelegramBotSettings(botSettings);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات بوت التلغرام بنجاح",
      });
    } catch (error) {
      console.error("Error saving Telegram bot settings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ إعدادات بوت التلغرام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleBot = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would toggle the bot status via your API
      // await api.toggleTelegramBot(!isEnabled);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEnabled(!isEnabled);
      
      toast({
        title: isEnabled ? "تم إيقاف البوت" : "تم تشغيل البوت",
        description: isEnabled ? "تم إيقاف بوت التلغرام بنجاح" : "تم تشغيل بوت التلغرام بنجاح",
      });
    } catch (error) {
      console.error("Error toggling Telegram bot:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تغيير حالة بوت التلغرام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestBot = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رسالة للاختبار",
        variant: "destructive",
      });
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // In a real app, you would test the bot via your API
      // const result = await api.testTelegramBot(testMessage);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      const success = Math.random() > 0.2; // 80% chance of success
      
      setTestResult({
        success,
        message: success 
          ? "تم إرسال الرسالة بنجاح!" 
          : "فشل إرسال الرسالة. تأكد من صحة رمز البوت ومعرف الدردشة."
      });
      
      if (success) {
        // Add the test message to recent messages
        setRecentMessages(prev => [
          { 
            id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1, 
            date: new Date().toLocaleString(), 
            text: testMessage, 
            direction: 'out' 
          },
          ...prev
        ]);
        
        setTestMessage("");
      }
    } catch (error) {
      console.error("Error testing Telegram bot:", error);
      setTestResult({
        success: false,
        message: "حدث خطأ أثناء اختبار البوت. يرجى المحاولة مرة أخرى."
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading && !botSettings.botToken) {
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
            إعدادات بوت التلغرام
          </CardTitle>
          <CardDescription>
            جاري تحميل الإعدادات...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full border ${
      theme === 'dark' 
        ? 'border-blue-800 bg-blue-950/30' 
        : 'border-blue-200 bg-blue-50/50'
    }`}>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <CardTitle className={`text-xl ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              إعدادات بوت التلغرام
            </CardTitle>
            <CardDescription>
              إدارة إعدادات بوت التلغرام للتواصل مع العملاء
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleBot}
              disabled={isLoading}
            />
            <Label className="cursor-pointer">
              {isEnabled ? "مفعّل" : "معطّل"}
            </Label>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="settings"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              الإعدادات الأساسية
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              الإشعارات
            </TabsTrigger>
            <TabsTrigger 
              value="test"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              اختبار وسجل الرسائل
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="botToken" className="text-right block">رمز البوت (Bot Token)</Label>
                <Input
                  id="botToken"
                  name="botToken"
                  value={botSettings.botToken}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi"
                />
                <p className="text-xs text-muted-foreground text-right">
                  يمكنك الحصول على رمز البوت من <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="underline">BotFather</a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chatId" className="text-right block">معرف الدردشة (Chat ID)</Label>
                <Input
                  id="chatId"
                  name="chatId"
                  value={botSettings.chatId}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="-1001234567890"
                />
                <p className="text-xs text-muted-foreground text-right">
                  معرف المجموعة أو القناة التي سيرسل إليها البوت الإشعارات
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage" className="text-right block">رسالة الترحيب</Label>
              <Textarea
                id="welcomeMessage"
                name="welcomeMessage"
                value={botSettings.welcomeMessage}
                onChange={handleChange}
                disabled={isLoading}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right min-h-[100px]`}
                placeholder="أدخل رسالة الترحيب التي سيرسلها البوت عند بدء المحادثة"
              />
            </div>
            
            <Alert className={theme === 'dark' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}>
              <Bot className="h-4 w-4" />
              <AlertTitle>كيفية إعداد بوت التلغرام</AlertTitle>
              <AlertDescription className="text-right">
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>افتح تطبيق تلغرام وابحث عن @BotFather</li>
                  <li>أرسل الأمر /newbot واتبع التعليمات لإنشاء بوت جديد</li>
                  <li>ستحصل على رمز البوت (Bot Token)، انسخه وألصقه في الحقل أعلاه</li>
                  <li>أضف البوت إلى المجموعة أو القناة التي تريد استلام الإشعارات فيها</li>
                  <li>للحصول على معرف الدردشة (Chat ID)، أرسل رسالة في المجموعة ثم قم بزيارة: https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates</li>
                  <li>ابحث عن "chat":{"id":XXXXXXXXXX} في النتيجة، هذا هو معرف الدردشة</li>
                </ol>
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyNewOrders" className="cursor-pointer">إشعار بالطلبات الجديدة</Label>
                <Switch
                  id="notifyNewOrders"
                  checked={botSettings.notifyNewOrders}
                  onCheckedChange={(checked) => handleSwitchChange('notifyNewOrders', checked)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyLowStock" className="cursor-pointer">إشعار بانخفاض المخزون</Label>
                <Switch
                  id="notifyLowStock"
                  checked={botSettings.notifyLowStock}
                  onCheckedChange={(checked) => handleSwitchChange('notifyLowStock', checked)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyNewUsers" className="cursor-pointer">إشعار بالمستخدمين الجدد</Label>
                <Switch
                  id="notifyNewUsers"
                  checked={botSettings.notifyNewUsers}
                  onCheckedChange={(checked) => handleSwitchChange('notifyNewUsers', checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold" className="text-right block">حد المخزون المنخفض</Label>
              <Select
                value={botSettings.lowStockThreshold}
                onValueChange={(value) => handleSelectChange('lowStockThreshold', value)}
                disabled={isLoading || !botSettings.notifyLowStock}
              >
                <SelectTrigger className={`w-full ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700' 
                    : 'bg-white border-blue-200'
                }`}>
                  <SelectValue placeholder="اختر الحد" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 10, 15, 20].map(value => (
                    <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground text-right">
                سيتم إرسال إشعار عندما ينخفض مخزون أي منتج عن هذا الحد
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newOrderTemplate" className="text-right block">قالب إشعار الطلب الجديد</Label>
              <Textarea
                id="newOrderTemplate"
                name="newOrderTemplate"
                value={botSettings.newOrderTemplate}
                onChange={handleChange}
                disabled={isLoading || !botSettings.notifyNewOrders}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right min-h-[100px]`}
              />
              <p className="text-xs text-muted-foreground text-right">
                يمكنك استخدام المتغيرات التالية: {{orderNumber}}، {{customerName}}، {{total}}، {{items}}، {{date}}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderStatusTemplate" className="text-right block">قالب تحديث حالة الطلب</Label>
              <Textarea
                id="orderStatusTemplate"
                name="orderStatusTemplate"
                value={botSettings.orderStatusTemplate}
                onChange={handleChange}
                disabled={isLoading}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right min-h-[100px]`}
              />
              <p className="text-xs text-muted-foreground text-right">
                يمكنك استخدام المتغيرات التالية: {{orderNumber}}، {{status}}، {{date}}، {{trackingNumber}}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="test" className="mt-0 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="testMessage" className="text-right block">رسالة اختبار</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleTestBot}
                      disabled={isTesting || isLoading || !botSettings.botToken || !botSettings.chatId}
                      className={`h-11 ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          إرسال
                        </>
                      )}
                    </Button>
                    <Input
                      id="testMessage"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      disabled={isTesting || isLoading}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right h-11 flex-1`}
                      placeholder="أدخل رسالة للاختبار"
                    />
                  </div>
                </div>
              </div>
              
              {testResult && (
                <Alert variant={testResult.success ? "default" : "destructive"} className={
                  testResult.success 
                    ? theme === 'dark' ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
                    : undefined
                }>
                  {testResult.success ? (
                    <CheckCircle2className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{testResult.success ? "نجاح" : "خطأ"}</AlertTitle>
                  <AlertDescription>{testResult.message}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  سجل الرسائل الأخيرة
                </h3>
                
                <div className={`border rounded-md p-4 max-h-[400px] overflow-y-auto ${
                  theme === 'dark' ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50/50'
                }`}>
                  {recentMessages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">لا توجد رسائل حديثة</p>
                  ) : (
                    <div className="space-y-4">
                      {recentMessages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.direction === 'out' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            message.direction === 'out'
                              ? theme === 'dark' ? 'bg-blue-800 text-blue-100' : 'bg-blue-500 text-white'
                              : theme === 'dark' ? 'bg-slate-700 text-slate-100' : 'bg-gray-200 text-gray-800'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.direction === 'out'
                                ? theme === 'dark' ? 'text-blue-300' : 'text-blue-100'
                                : theme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                            }`}>
                              {message.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <Alert className={theme === 'dark' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}>
                <Bell className="h-4 w-4" />
                <AlertTitle>ميزات بوت التلغرام</AlertTitle>
                <AlertDescription className="text-right">
                  <ul className="list-disc list-inside space-y-2 mt-2">
                    <li>إرسال إشعارات تلقائية للطلبات الجديدة وتحديثات الحالة</li>
                    <li>تنبيهات انخفاض المخزون لإعادة الطلب في الوقت المناسب</li>
                    <li>إشعارات بالمستخدمين الجدد المسجلين في الموقع</li>
                    <li>إمكانية الرد على استفسارات العملاء مباشرة عبر البوت</li>
                    <li>إرسال عروض وكوبونات خصم للعملاء</li>
                    <li>تتبع الطلبات وعرض حالتها للعملاء</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleSaveSettings}
          disabled={isLoading}
          className={`h-11 ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.8)]'
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-all duration-300`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ الإعدادات"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}