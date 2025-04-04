import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useThemeStore } from "@/lib/theme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Loader2 } from "lucide-react";

// Types
type ProfitData = {
  productId: string;
  productName: string;
  month: string;
  year: number;
  salesCount: number;
  revenue: number;
  cost: number;
  profit: number;
};

type ProductProfitSummary = {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
};

type MonthlyProfitData = {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
};

const MONTHS = [
  "يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو", 
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export function ProfitChart() {
  const { theme } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profitData, setProfitData] = useState<ProfitData[]>([]);
  const [productSummary, setProductSummary] = useState<ProductProfitSummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyProfitData[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("monthly");

  useEffect(() => {
    const fetchProfitData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch this data from your API
        // const data = await api.getProfitData(selectedYear);
        
        // For demo purposes, we'll create mock data
        const mockData: ProfitData[] = [];
        const currentYear = parseInt(selectedYear);
        
        // Generate mock data for each month and some products
        const products = [
          { id: "1", name: "شاحن سامسونج سريع" },
          { id: "2", name: "سماعات بلوتوث" },
          { id: "3", name: "كفر حماية آيفون 13" },
          { id: "4", name: "حامل هاتف للسيارة" },
          { id: "5", name: "بطارية خارجية 10000mAh" }
        ];
        
        for (let month = 0; month < 12; month++) {
          for (const product of products) {
            const salesCount = Math.floor(Math.random() * 100) + 10;
            const unitPrice = Math.floor(Math.random() * 50) + 20;
            const unitCost = Math.floor(unitPrice * 0.6); // 60% of selling price
            const revenue = salesCount * unitPrice;
            const cost = salesCount * unitCost;
            
            mockData.push({
              productId: product.id,
              productName: product.name,
              month: MONTHS[month],
              year: currentYear,
              salesCount,
              revenue,
              cost,
              profit: revenue - cost
            });
          }
        }
        
        setProfitData(mockData);
        
        // Calculate product summary
        const productMap = new Map<string, ProductProfitSummary>();
        
        mockData.forEach(item => {
          if (!productMap.has(item.productId)) {
            productMap.set(item.productId, {
              productId: item.productId,
              productName: item.productName,
              totalSales: 0,
              totalRevenue: 0,
              totalCost: 0,
              totalProfit: 0,
              profitMargin: 0
            });
          }
          
          const product = productMap.get(item.productId)!;
          product.totalSales += item.salesCount;
          product.totalRevenue += item.revenue;
          product.totalCost += item.cost;
          product.totalProfit += item.profit;
        });
        
        // Calculate profit margin
        productMap.forEach(product => {
          product.profitMargin = (product.totalProfit / product.totalRevenue) * 100;
        });
        
        setProductSummary(Array.from(productMap.values()));
        
        // Calculate monthly data
        const monthlyMap = new Map<string, MonthlyProfitData>();
        
        mockData.forEach(item => {
          if (!monthlyMap.has(item.month)) {
            monthlyMap.set(item.month, {
              month: item.month,
              revenue: 0,
              cost: 0,
              profit: 0
            });
          }
          
          const monthData = monthlyMap.get(item.month)!;
          monthData.revenue += item.revenue;
          monthData.cost += item.cost;
          monthData.profit += item.profit;
        });
        
        // Sort by month order
        const monthlyDataArray = Array.from(monthlyMap.values());
        monthlyDataArray.sort((a, b) => {
          return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
        });
        
        setMonthlyData(monthlyDataArray);
        
        // Set available years (for demo, we'll just use current year and previous year)
        const currentYearNum = new Date().getFullYear();
        setAvailableYears([currentYearNum.toString(), (currentYearNum - 1).toString()]);
        
      } catch (error) {
        console.error("Error fetching profit data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfitData();
  }, [selectedYear]);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-md shadow-md ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}>
          <p className="font-bold text-right">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-right" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
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
            تحليل الأرباح
          </CardTitle>
          <CardDescription>
            جاري تحميل البيانات...
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
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <CardTitle className={`text-xl ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}>
            تحليل الأرباح
          </CardTitle>
          <CardDescription>
            عرض تفصيلي للإيرادات والتكاليف والأرباح
          </CardDescription>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className={`w-[120px] ${
              theme === 'dark' 
                ? 'bg-blue-900/30 border-blue-700' 
                : 'bg-white border-blue-200'
            }`}>
              <SelectValue placeholder="اختر السنة" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className={`w-[120px] ${
              theme === 'dark' 
                ? 'bg-blue-900/30 border-blue-700' 
                : 'bg-white border-blue-200'
            }`}>
              <SelectValue placeholder="اختر الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">شهري</SelectItem>
              <SelectItem value="products">حسب المنتج</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger 
              value="chart"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              رسم بياني
            </TabsTrigger>
            <TabsTrigger 
              value="distribution"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              توزيع الأرباح
            </TabsTrigger>
            <TabsTrigger 
              value="summary"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              ملخص
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="mt-0">
            <div className="w-full h-[400px]">
              {selectedTimeframe === "monthly" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="revenue" name="الإيرادات" fill="#3b82f6" />
                    <Bar dataKey="cost" name="التكاليف" fill="#ef4444" />
                    <Bar dataKey="profit" name="الأرباح" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productSummary}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="totalRevenue" name="الإيرادات" fill="#3b82f6" />
                    <Bar dataKey="totalCost" name="التكاليف" fill="#ef4444" />
                    <Bar dataKey="totalProfit" name="الأرباح" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="mt-0">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productSummary}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="totalProfit"
                    nameKey="productName"
                  >
                    {productSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-0">
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
              }`}>
                <thead>
                  <tr className={`border-b ${
                    theme === 'dark' ? 'border-blue-800' : 'border-blue-200'
                  }`}>
                    <th className="py-3 px-4 text-right">المنتج</th>
                    <th className="py-3 px-4 text-right">المبيعات</th>
                    <th className="py-3 px-4 text-right">الإيرادات</th>
                    <th className="py-3 px-4 text-right">التكاليف</th>
                    <th className="py-3 px-4 text-right">الأرباح</th>
                    <th className="py-3 px-4 text-right">هامش الربح</th>
                  </tr>
                </thead>
                <tbody>
                  {productSummary.map((product, index) => (
                    <tr key={product.productId} className={`border-b ${
                      theme === 'dark' ? 'border-blue-800' : 'border-blue-200'
                    } ${index % 2 === 0 ? theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50/50' : ''}`}>
                      <td className="py-3 px-4 text-right font-medium">{product.productName}</td>
                      <td className="py-3 px-4 text-right">{product.totalSales}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(product.totalRevenue)}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(product.totalCost)}</td>
                      <td className={`py-3 px-4 text-right font-bold ${
                        product.totalProfit > 0 
                          ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formatCurrency(product.totalProfit)}
                      </td>
                      <td className={`py-3 px-4 text-right ${
                        product.profitMargin > 30 
                          ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          : product.profitMargin > 15
                            ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                            : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {product.profitMargin.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`border-t-2 ${
                    theme === 'dark' ? 'border-blue-700 bg-blue-900/30' : 'border-blue-300 bg-blue-100/50'
                  } font-bold`}>
                    <td className="py-3 px-4 text-right">الإجمالي</td>
                    <td className="py-3 px-4 text-right">
                      {productSummary.reduce((sum, product) => sum + product.totalSales, 0)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(productSummary.reduce((sum, product) => sum + product.totalRevenue, 0))}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(productSummary.reduce((sum, product) => sum + product.totalCost, 0))}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatCurrency(productSummary.reduce((sum, product) => sum + product.totalProfit, 0))}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(productSummary.reduce((sum, product) => sum + product.totalProfit, 0) / 
                        productSummary.reduce((sum, product) => sum + product.totalRevenue, 0) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}