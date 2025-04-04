import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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

interface TelegramBotSettingsProps {
  botSettings: BotSettings;
  setBotSettings: (settings: BotSettings) => void;
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
              onChange={(e) => setBotSettings({ ...botSettings, token: e.target.value })}
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
              onChange={(e) => setBotSettings({ ...botSettings, chatId: e.target.value })}
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
              onCheckedChange={(checked) => setBotSettings({ ...botSettings, enabled: checked })}
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
              onClick={onTestConnection}
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
            "حفظ إعدادات البوت"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}