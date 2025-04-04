import { useEffect, useState } from "react";
import { fine } from "@/lib/fine";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface LoginLog {
  id: number;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason: string | null;
}

export function LoginLogTable() {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    async function fetchLogs() {
      if (!session?.user?.id) return;
      
      try {
        const fetchedLogs = await fine.table("login_logs")
          .select()
          .eq("userId", session.user.id)
          .order("timestamp", { ascending: false })
          .limit(20);
        
        setLogs(fetchedLogs || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load login history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
  }, [session?.user?.id, toast]);

  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), "PPpp");
    } catch (e) {
      return dateString;
    }
  }

  function truncateUserAgent(userAgent: string) {
    return userAgent.length > 50 ? userAgent.substring(0, 50) + "..." : userAgent;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>
          Recent login attempts to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No login history found</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date &Time</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="hidden md:table-cell">Device</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>{log.ipAddress}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {log.userAgent ? truncateUserAgent(log.userAgent) : "Unknown"}
                    </TableCell>
                    <TableCell>
                      {log.success ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Failed
                        </Badge>
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