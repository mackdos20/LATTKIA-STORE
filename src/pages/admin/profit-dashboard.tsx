import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useThemeStore } from "@/lib/theme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

// نوع بيانات المنتج مع سعر الشراء
type ProductWithCost = {
  id: string;
  name: string;
  price: number; // سعر البيع
  costPrice: number; // سعر الشراء
  sales: number; // عدد المبيعات
  profit: number; // الربح الإجمالي
};

// نوع بيانات الأرباح الشهرية
type MonthlyProfit = {
  month: string;
  sales: number;
  profit: number;
};

// نوع بيانات الأرباح حسب الفئة
type CategoryProfit = {
  name: string;
  profit: number;
  sales: number;
};

export default function AdminProfitDashboard() {
  const { theme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("year");
  const [topProducts, setTopProducts] = useState<ProductWithCost[]>([]);
  const [monthlyProfits, setMonthlyProfits] = useState<MonthlyProfit[]>([]);
  const [categoryProfits, setCategoryProfits] = useState<CategoryProfit[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [averageMargin, setAverageMargin] = useState(0);

  // ألوان للمخططات
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // في التطبيق الحقيقي، ستقوم بجلب البيانات من API
        // هنا نستخدم بيانات وهمية للعرض
        
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // بيانات المنتجات الأكثر ربحية
        const mockTopProducts: ProductWithCost[] = [
          { id: "1", name: "كفر حماية آيفون 13", price: 25, costPrice: 10, sales: 120, profit: 1800 },
          { id: "2", name: "شاحن سريع سامسونج", price: 35, costPrice: 15, sales: 85, profit: 1700 },
          { id: "3", name: "سماعات بلوتوث", price: 50, costPrice: 20, sales: 65, profit: 1950 },
          { id: "4", name: "حامل هاتف للسيارة", price: 20, costPrice: 8, sales: 150, profit: 1800 },
          { id: "5", name: "واقي شاشة زجاجي", price: 15, costPrice: 5, sales: 200, profit: 2000 },
        ];
        
        // بيانات الأرباح الشهرية
        const mockMonthlyProfits: MonthlyProfit[] = [
          { month: "يناير", sales: 320, profit: 4800 },
          { month: "فبراير", sales: 280, profit: 4200 },
          { month: "مارس", sales: 350, profit: 5250 },
          { month: "أبريل", sales: 400, profit: 6000 },
          { month: "مايو", sales: 450, profit: 6750 },
          { month: "يونيو", sales: 500, profit: 7500 },
          { month: "يوليو", sales: 550, profit: 8250 },
          { month: "أغسطس", sales: 600, profit: 9000 },
          { month: "سبتمبر", sales: 520, profit: 7800 },
          { month: "أكتوبر", sales: 480,profit: 7200 },
          { month: "نوفمبر", sales: 420, profit: 6300 },
          { month: "ديسمبر", sales: 550, profit: 8250 },
        ];
        
        // بيانات الأرباح حسب الفئة
        const mockCategoryProfits: CategoryProfit[] = [
          { name: "كفرات حماية", profit: 12000, sales: 800 },
          { name: "شواحن", profit: 9500, sales: 450 },
          { name: "سماعات", profit: 8200, sales: 320 },
          { name: "اكسسوارات سيارة", profit: 6800, sales: 410 },
          { name: "واقيات شاشة", profit: 5500, sales: 550 },
        ];
        
        // حساب الإجماليات
        const totalSalesCount = mockMonthlyProfits.reduce((sum, item) => sum + item.sales, 0);
        const totalProfitAmount = mockMonthlyProfits.reduce((sum, item) => sum + item.profit, 0);
        const avgMargin = (totalProfitAmount / (totalProfitAmount + totalSalesCount * 10)) * 100; // تقدير تقريبي
        
        setTopProducts(mockTopProducts);
        setMonthlyProfits(mockMonthlyProfits);
        setCategoryProfits(mockCategoryProfits);
        setTotalSales(totalSalesCount);
        setTotalProfit(totalProfitAmount);
        setAverageMargin(Math.round(avgMargin));
      } catch (error) {
        console.error("Error fetching profit data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  // تنسيق الأرقام بالعملة
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  // تنسيق النسبة المئوية
  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  // مكون مخصص للتوولتيب في المخطط
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-md shadow-md ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes("ربح") ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-2xl md:text-3xl font-bold mb-6 ${
          theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
        }`}>
          لوحة الأرباح والمبيعات
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-blue-800 bg-blue-950/30' 
                  : 'border-blue-200 bg-blue-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">إجمالي المبيعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    {totalSales}
                  </p>
                  <p className="text-sm text-muted-foreground">عدد المنتجات المباعة</p>
                </CardContent>
              </Card>
              
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-green-800 bg-green-950/30' 
                  : 'border-green-200 bg-green-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">إجمالي الأرباح</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {formatCurrency(totalProfit)}
                  </p>
                  <p className="text-sm text-muted-foreground">صافي الربح بعد خصم التكاليف</p>
                </CardContent>
              </Card>
              
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-purple-800 bg-purple-950/30' 
                  : 'border-purple-200 bg-purple-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">متوسط هامش الربح</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`}>
                    {formatPercentage(averageMargin)}
                  </p>
                  <p className="text-sm text-muted-foreground">نسبة الربح من سعر البيع</p>
                </CardContent>
              </Card>
            </div>
            
            {/* أدوات التصفية */}
            <div className="flex justify-end mb-6">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className={`w-[180px] ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700' 
                    : 'bg-white border-blue-200'
                }`}>
                  <SelectValue placeholder="اختر الفترة الزمنية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">الشهر الحالي</SelectItem>
                  <SelectItem value="quarter">الربع الحالي</SelectItem>
                  <SelectItem value="year">السنة الحالية</SelectItem>
                  <SelectItem value="all">كل الفترات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* علامات التبويب للمخططات */}
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger 
                  value="monthly"
                  className={`text-base py-3 ${
                    theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
                  }`}
                >
                  الأرباح الشهرية
                </TabsTrigger>
                <TabsTrigger 
                  value="products"
                  className={`text-base py-3 ${
                    theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
                  }`}
                >
                  المنتجات الأكثر ربحية
                </TabsTrigger>
                <TabsTrigger 
                  value="categories"
                  className={`text-base py-3 ${
                    theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
                  }`}
                >
                  الأرباح حسب الفئة
                </TabsTrigger>
              </TabsList>
              
              {/* مخطط الأرباح الشهرية */}
              <TabsContent value="monthly" className="mt-0">
                <Card className={`border ${
                  theme === 'dark' 
                    ? 'border-blue-800 bg-blue-950/30' 
                    : 'border-blue-200 bg-blue-50/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-xl ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      الأرباح والمبيعات الشهرية
                    </CardTitle>
                    <CardDescription>
                      مقارنة بين المبيعات والأرباح على مدار العام
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyProfits}
                          margin={{ top: 20, right:30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                          <XAxis dataKey="month" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                          <YAxis yAxisId="left" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                          <YAxis yAxisId="right" orientation="right" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="sales"
                            name="المبيعات"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="profit"
                            name="الربح"
                            stroke="#10b981"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* مخطط المنتجات الأكثر ربحية */}
              <TabsContent value="products" className="mt-0">
                <Card className={`border ${
                  theme === 'dark' 
                    ? 'border-blue-800 bg-blue-950/30' 
                    : 'border-blue-200 bg-blue-50/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-xl ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      المنتجات الأكثر ربحية
                    </CardTitle>
                    <CardDescription>
                      أعلى 5 منتجات من حيث الربح الإجمالي
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topProducts}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                          <XAxis 
                            dataKey="name" 
                            stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} 
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar 
                            dataKey="profit" 
                            name="الربح الإجمالي" 
                            fill="#3b82f6" 
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="sales" 
                            name="عدد المبيعات" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* مخطط الأرباح حسب الفئة */}
              <TabsContent value="categories" className="mt-0">
                <Card className={`border ${
                  theme === 'dark' 
                    ? 'border-blue-800 bg-blue-950/30' 
                    : 'border-blue-200 bg-blue-50/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-xl ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      الأرباح حسب الفئة
                    </CardTitle>
                    <CardDescription>
                      توزيع الأرباح على فئات المنتجات المختلفة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryProfits}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="profit"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryProfits.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* جدول تفاصيل المنتجات */}
            <Card className={`mt-8 border ${
              theme === 'dark' 
                ? 'border-blue-800 bg-blue-950/30' 
                : 'border-blue-200 bg-blue-50/50'
            }`}>
              <CardHeader>
                <CardTitle className={`text-xl ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  تفاصيل المنتجات الأكثر ربحية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className={`border-b ${theme === 'dark' ? 'border-blue-800' : 'border-blue-200'}`}>
                        <th className="text-right py-3 px-4">المنتج</th>
                        <th className="text-right py-3 px-4">سعر البيع</th>
                        <th className="text-right py-3 px-4">سعر الشراء</th>
                        <th className="text-right py-3 px-4">هامش الربح</th>
                        <th className="text-right py-3 px-4">المبيعات</th>
                        <th className="text-right py-3 px-4">إجمالي الربح</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product) => {
                        const margin = ((product.price - product.costPrice) / product.price) * 100;
                        
                        return (
                          <tr 
                            key={product.id} 
                            className={`border-b ${theme === 'dark' ? 'border-blue-800/50' : 'border-blue-100'} hover:${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'}`}
                          >
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4">{formatCurrency(product.price)}</td>
                            <td className="py-3 px-4">{formatCurrency(product.costPrice)}</td>
                            <td className="py-3 px-4">{formatPercentage(Math.round(margin))}</td>
                            <td className="py-3 px-4">{product.sales}</td>
                            <td className={`py-3 px-4 font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              {formatCurrency(product.profit)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}