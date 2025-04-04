import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useThemeStore } from "@/lib/theme";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useAuthStore } from "@/lib/stores/auth-store";
import { fine } from "@/lib/fine";

type LoginLog = {
  id: number;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason: string | null;
};

export function LoginLogTable() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.id) return;
      
      try {
        // In a real app, you would fetch from the database
        // const fetchedLogs = await fine.table("login_logs").select().eq("userId", user.id).order("timestamp", { ascending: false }).limit(20);
        
        // For demo purposes, we'll create mock data
        const mockLogs: LoginLog[] = [
          {
            id: 1,
            userId: user.id,
            timestamp: new Date().toISOString(),
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
            success: true,
            failureReason: null
          },
          {
            id: 2,
            userId: user.id,
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            success: true,
            failureReason: null
          },
          {
            id: 3,
            userId: user.id,
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            ipAddress: "192.168.1.1",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            success: false,
            failureReason: "كلمة مرور غير صحيحة"
          }
        ];
        
        setLogs(mockLogs);
      } catch (error) {
        console.error("Error fetching login logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp", { locale: ar });
    } catch (e) {
      return dateString;
    }
  };

  const truncateUserAgent = (userAgent: string) => {
    return userAgent.length > 40 ? userAgent.substring(0, 40) + "..." : userAgent;
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
          سجل تسجيل الدخول
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">جاري التحميل...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-4">لا توجد سجلات تسجيل دخول</div>
        ) : (
          <div className="overflow-x-auto">
            <Table dir="rtl">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ والوقت</TableHead>
                  <TableHead className="text-right">عنوان IP</TableHead>
                  <TableHead className="text-right hidden md:table-cell">الجهاز</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{formatDate(log.timestamp)}</TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell className="hidden md:table-cell">{truncateUserAgent(log.userAgent)}</TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge className="bg-green-500 hover:bg-green-600">ناجح</Badge>
                      ) : (
                        <Badge variant="destructive">فاشل - {log.failureReason}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}