import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, TrendingUp, DollarSign, Percent, Package, Calendar, Download } from "lucide-react";
import { LineChart, BarChart, PieChart } from "@/components/charts";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    categoryProfits: [],
    profitTrend: [],
    monthlyStats: []
  });

  // Fetch data using React Query
  const { data: profitData, isLoading: isDataLoading, error } = useQuery({
    queryKey: ['profit', timeRange],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/profit?range=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch profit data');
        return response.json();
      } catch (error) {
        console.error('Error fetching profit data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  // Update stats when data is loaded
  useEffect(() => {
    if (profitData) {
      setStats(profitData);
      setIsLoading(false);
    }
  }, [profitData]);

  // Export data to Excel
  const exportToExcel = useCallback(() => {
    try {
      const worksheet = XLSX.utils.json_to_sheet([
        { 'المؤشر': 'إجمالي المبيعات', 'القيمة': stats.totalSales },
        { 'المؤشر': 'إجمالي الأرباح', 'القيمة': stats.totalProfit },
        { 'المؤشر': 'متوسط هامش الربح', 'القيمة': stats.averageMargin },
        ...stats.topProducts.map((p: any) => ({
          'المنتج': p.name,
          'الربح': p.profit,
          'هامش الربح': p.margin
        })),
        ...stats.categoryProfits.map((c: any) => ({
          'الفئة': c.name,
          'الربح': c.profit,
          'النسبة': c.percentage
        }))
      ]);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'تقرير الأرباح');
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `تقرير_الأرباح_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast({
        title: "تم التصدير",
        description: "تم تصدير البيانات بنجاح",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    }
  }, [stats, toast]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البيانات",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            لوحة تحكم الأرباح
          </h1>
          <Button
            onClick={exportToExcel}
            className={`${
              theme === 'dark' 
                ? 'bg-green-600 hover:bg-green-700 shadow-[0_0_15px_rgba(22,163,74,0.5)] hover:shadow-[0_0_20px_rgba(22,163,74,0.7)]' 
                : 'bg-green-600 hover:bg-green-700'
            } transition-all duration-300`}
          >
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4">
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
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>

        {isLoading || isDataLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSales.toLocaleString()} $</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +12% عن الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProfit.toLocaleString()} $</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +15% عن الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">متوسط هامش الربح</CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.averageMargin.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +3% عن الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">المنتجات الأكثر ربحية</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.topProducts.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    منتج يزيد هامش ربحه عن 30%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                <TabsTrigger value="products">المنتجات</TabsTrigger>
                <TabsTrigger value="categories">الفئات</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                    <CardHeader>
                      <CardTitle>تطور الأرباح</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChart 
                        data={stats.profitTrend} 
                        options={{
                          responsive: true,
                          interaction: {
                            mode: 'index' as const,
                            intersect: false,
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => `${value} $`
                              }
                            }
                          }
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                    <CardHeader>
                      <CardTitle>الإحصائيات الشهرية</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChart 
                        data={stats.monthlyStats} 
                        options={{
                          responsive: true,
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value) => `${value} $`
                              }
                            }
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products" className="space-y-4">
                <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                  <CardHeader>
                    <CardTitle>المنتجات الأكثر ربحية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.topProducts.map((product: any, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">هامش ربح: {product.margin}%</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{product.profit.toLocaleString()} $</p>
                            <p className="text-sm text-muted-foreground">ربح</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                    <CardHeader>
                      <CardTitle>الأرباح حسب الفئة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChart 
                        data={stats.categoryProfits} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom' as const,
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const label = context.label || '';
                                  const value = context.raw || 0;
                                  return `${label}: ${value} $ (${((value / stats.totalProfit) * 100).toFixed(1)}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card className={theme === 'dark' ? 'bg-blue-950/30 border-blue-800' : ''}>
                    <CardHeader>
                      <CardTitle>تفاصيل الفئات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.categoryProfits.map((category: any, index) => (
                          <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/50">
                            <div>
                              <h4 className="font-medium">{category.name}</h4>
                              <p className="text-sm text-muted-foreground">{category.percentage}% من إجمالي الأرباح</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{category.profit.toLocaleString()} $</p>
                              <p className="text-sm text-muted-foreground">ربح</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfitDashboard; 