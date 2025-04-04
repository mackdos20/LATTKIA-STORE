import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/lib/theme";
import { Loader2, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface TelegramBotSettingsProps {
  botSettings: BotSettings;
  setBotSettings: React.Dispatch<React.SetStateAction<BotSettings>>;
  botStatus: "connected" | "disconnected" | "unknown";
  onSaveSettings: () => Promise<void>;
  onTestConnection: () => Promise<void>;
  isSaving: boolean;
  isTestingConnection: boolean;
}

export function TelegramBotSettings({
  botSettings,
  setBotSettings,
  botStatus,
  onSaveSettings,
  onTestConnection,
  isSaving,
  isTestingConnection
}: TelegramBotSettingsProps) {
  const { theme } = useThemeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBotSettings(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className={`border ${
      theme === 'dark' 
        ? 'border-blue-800 bg-blue-950/30' 
        : 'border-blue-200 bg-blue-50/50'
    }`}>
      <CardHeader>
        <CardTitle className={`text-xl ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>
          إعدادات بوت التلجرام
        </CardTitle>
        <CardDescription>
          قم بإعداد بوت التلجرام الخاص بمتجرك
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-right block">توكن البوت (Bot Token)</Label>
            <Input
              id="token"
              name="token"
              value={botSettings.token}
              onChange={handleChange}
              disabled={isSaving}
              className={`${
                theme === 'dark' 
                  ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                  : 'bg-white border-blue-200 focus:border-blue-400'
              } text-right h-11 font-mono`}
              placeholder="1234567890:ABCDefGhIJKLmnoPQRSTuvwxYZ123456789"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              يمكنك الحصول على توكن البوت من @BotFather على تلجرام
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chatId" className="text-right block">معرف الدردشة (Chat ID)</Label>
            <Input
              id="chatId"
              name="chatId"
              value={botSettings.chatId}
              onChange={handleChange}
              disabled={isSaving}
              className={`${
                theme === 'dark' 
                  ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                  : 'bg-white border-blue-200 focus:border-blue-400'
              } text-right h-11 font-mono`}
              placeholder="-1001234567890"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground">
              معرف القناة أو المجموعة التي سيرسل إليها البوت الإشعارات
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={onTestConnection}
              disabled={isTestingConnection || !botSettings.token || !botSettings.chatId}
              variant="outline"
              className={`h-10 ${
                theme === 'dark'
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isTestingConnection ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الاختبار...
                </>
              ) : (
                <>
                  <Bot className="ml-2 h-4 w-4" />
                  اختبار الاتصال
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className={`p-4 rounded-md ${
          botStatus === "connected" 
            ? theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
            : botStatus === "disconnected"
              ? theme === 'dark' ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
              : theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center">
            <Badge 
              variant={botStatus === "connected" ? "default" : "destructive"}
              className={`text-sm py-1 px-3 ml-2 ${
                botStatus === "connected" 
                  ? 'bg-green-600' 
                  : botStatus === "disconnected" 
                    ? 'bg-red-600' 
                    : 'bg-yellow-600'
              }`}
            >
              {botStatus === "connected" ? "متصل" : botStatus === "disconnected" ? "غير متصل" : "غير معروف"}
            </Badge>
            <span className={`text-sm ${
              botStatus === "connected" 
                ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                : botStatus === "disconnected"
                  ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {botStatus === "connected" 
                ? "البوت متصل ويعمل بشكل صحيح" 
                : botStatus === "disconnected" 
                  ? "لا يمكن الاتصال بالبوت. تأكد من صحة التوكن ومعرف الدردشة" 
                  : "لم يتم اختبار الاتصال بعد"}
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-md ${
          theme === 'dark' ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className="font-medium mb-2">كيفية إعداد بوت التلجرام:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>افتح تطبيق تلجرام وابحث عن @BotFather</li>
            <li>أرسل الأمر /newbot واتبع التعليمات لإنشاء بوت جديد</li>
            <li>ستحصل على توكن البوت، انسخه وألصقه في الحقل أعلاه</li>
            <li>أنشئ قناة أو مجموعة وأضف البوت إليها كمسؤول</li>
            <li>للحصول على معرف القناة/المجموعة، أرسل رسالة إلى @getidsbot</li>
            <li>انسخ معرف القناة/المجموعة وألصقه في الحقل أعلاه</li>
            <li>اختبر الاتصال للتأكد من أن كل شيء يعمل بشكل صحيح</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSaveSettings}
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
            "حفظ الإعدادات"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}