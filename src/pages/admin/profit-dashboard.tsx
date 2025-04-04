import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, DollarSign, Percent, Package } from "lucide-react";
import { LineChart, BarChart, PieChart } from "@/components/charts";

const ProfitDashboard = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year" | "all">("month");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    averageMargin: 0,
    topProducts: [],
    categoryProfits: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // في التطبيق الحقيقي، سنقوم بجلب البيانات من الخادم
        // هنا سنستخدم بيانات وهمية للعرض
        const mockStats = {
          totalSales: 15000,
          totalProfit: 5000,
          averageMargin: 33.33,
          topProducts: [
            { name: "منتج 1", profit: 2000 },
            { name: "منتج 2", profit: 1500 },
            { name: "منتج 3", profit: 1000 }
          ],
          categoryProfits: [
            { name: "فئة 1", profit: 3000 },
            { name: "فئة 2", profit: 2000 }
          ]
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب الإحصائيات",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeRange, toast]);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          لوحة تحكم الأرباح
        </h1>

        <div className="mb-6">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">الشهر الحالي</SelectItem>
              <SelectItem value="quarter">الربع الحالي</SelectItem>
              <SelectItem value="year">السنة الحالية</SelectItem>
              <SelectItem value="all">الكل</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSales} $</div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProfit} $</div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">متوسط هامش الربح</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageMargin}%</div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المنتجات الأكثر ربحية</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.topProducts.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
            <CardHeader>
              <CardTitle>تطور الأرباح</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={[]} />
            </CardContent>
          </Card>

          <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
            <CardHeader>
              <CardTitle>الأرباح حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={stats.categoryProfits} />
            </CardContent>
          </Card>

          <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
            <CardHeader>
              <CardTitle>توزيع الأرباح</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={stats.categoryProfits} />
            </CardContent>
          </Card>

          <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
            <CardHeader>
              <CardTitle>المنتجات الأكثر ربحية</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={stats.topProducts} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfitDashboard; 