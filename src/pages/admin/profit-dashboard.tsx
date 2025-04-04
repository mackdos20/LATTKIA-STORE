import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { LineChart, BarChart, PieChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface ProfitData {
  totalSales: number;
  totalProfit: number;
  averageMargin: number;
  topProducts: Array<{
    name: string;
    profit: number;
    sales: number;
  }>;
  categoryProfits: Array<{
    name: string;
    profit: number;
  }>;
  profitTrend: Array<{
    date: string;
    profit: number;
  }>;
  monthlyStats: Array<{
    month: string;
    profit: number;
    sales: number;
  }>;
}

const ProfitDashboard = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProfit: 0,
    averageMargin: 0,
    topProducts: [],
    categoryProfits: [],
    profitTrend: [],
    monthlyStats: []
  });
  
  const { data, isLoading, error } = useQuery<ProfitData>({
    queryKey: ['profit', timeRange],
    queryFn: async () => {
      // Replace with actual API call
      return {
        totalSales: 15000,
        totalProfit: 5000,
        averageMargin: 33.33,
        topProducts: [
          { name: 'منتج 1', profit: 1200, sales: 3000 },
          { name: 'منتج 2', profit: 1000, sales: 2500 },
          { name: 'منتج 3', profit: 800, sales: 2000 }
        ],
        categoryProfits: [
          { name: 'فئة 1', profit: 2000 },
          { name: 'فئة 2', profit: 1500 },
          { name: 'فئة 3', profit: 1000 }
        ],
        profitTrend: [
          { date: '2024-01-01', profit: 1000 },
          { date: '2024-01-02', profit: 1200 },
          { date: '2024-01-03', profit: 1500 }
        ],
        monthlyStats: [
          { month: 'يناير', profit: 5000, sales: 15000 },
          { month: 'فبراير', profit: 6000, sales: 18000 },
          { month: 'مارس', profit: 7000, sales: 21000 }
        ]
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30 // 30 minutes
  });
  
  useEffect(() => {
    if (data) {
      setStats(data);
    }
  }, [data]);
  
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet([
        { 'الإجمالي': 'الإحصائيات', 'القيمة': '' },
        { 'الإجمالي': 'إجمالي المبيعات', 'القيمة': stats.totalSales },
        { 'الإجمالي': 'إجمالي الربح', 'القيمة': stats.totalProfit },
        { 'الإجمالي': 'متوسط الهامش', 'القيمة': stats.averageMargin },
        { 'الإجمالي': '', 'القيمة': '' },
        { 'الإجمالي': 'أفضل المنتجات', 'القيمة': '' },
        ...stats.topProducts.map(product => ({
          'الإجمالي': product.name,
          'القيمة': product.profit
        })),
        { 'الإجمالي': '', 'القيمة': '' },
        { 'الإجمالي': 'أرباح الفئات', 'القيمة': '' },
        ...stats.categoryProfits.map(category => ({
          'الإجمالي': category.name,
          'القيمة': category.profit
        }))
      ]);
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'تقرير الربح');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `تقرير_الربح_${format(new Date(), 'yyyy-MM-dd', { locale: ar })}.xlsx`);
      
      toast({
        title: "تم التصدير",
        description: "تم تصدير تقرير الربح بنجاح",
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    }
  };
  
  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <div className="text-center text-red-500">
            حدث خطأ أثناء تحميل البيانات
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            لوحة تحليل الربح
          </h1>
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">الأسبوع الحالي</SelectItem>
                <SelectItem value="month">الشهر الحالي</SelectItem>
                <SelectItem value="year">السنة الحالية</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToExcel} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير التقرير
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                إجمالي المبيعات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSales.toLocaleString()} ريال
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                إجمالي الربح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalProfit.toLocaleString()} ريال
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                متوسط الهامش
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averageMargin.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                عدد المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.topProducts.length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                اتجاه الربح
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={stats.profitTrend.map(item => ({
                  date: item.date,
                  profit: item.profit
                }))}
              />
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                أرباح الفئات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart
                data={stats.categoryProfits.map(item => ({
                  name: item.name,
                  profit: item.profit
                }))}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                أفضل المنتجات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart
                data={stats.topProducts.map(item => ({
                  name: item.name,
                  value: item.profit
                }))}
              />
            </CardContent>
          </Card>
          
          <Card className={`border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
          }`}>
            <CardHeader>
              <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                الإحصائيات الشهرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.monthlyStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{stat.month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-500">{stat.profit.toLocaleString()} ريال ربح</span>
                      <span className="text-blue-500">{stat.sales.toLocaleString()} ريال مبيعات</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfitDashboard; 