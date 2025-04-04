import { AdminLayout } from "@/components/layout/AdminLayout";
import { TelegramBotSettings } from "@/components/admin/telegram-bot-settings";
import { useThemeStore } from "@/lib/theme";

export default function TelegramBotPage() {
  const { theme } = useThemeStore();

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            إعدادات بوت التلغرام
          </h1>
          <p className="text-muted-foreground">
            إدارة إعدادات بوت التلغرام للتواصل مع العملاء وإرسال الإشعارات
          </p>
        </div>
        
        <TelegramBotSettings />
      </div>
    </AdminLayout>
  );
}