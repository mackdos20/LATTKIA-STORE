import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProfitChart } from "@/components/admin/profit-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/lib/theme";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfitDashboardPage() {
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock summary data
  const summaryData = {
    totalRevenue: 25680.45,
    totalCost: 15408.27,
    totalProfit: 10272.18,
    profitMargin: 40.0,
    totalOrders: 342,
    totalProducts: 128,
    revenueChange: 12.5, // percentage change from previous period
    profitChange: 18.3,
    ordersChange: 8.7,
    topProducts: [
      { name: "شاحن سامسونج سريع", profit: 2450.75, margin: 42.5 },
      { name: "سماعات بلوتوث", profit: 1875.30, margin: 38.2 },
      { name: "كفر حماية آيفون 13", profit: 1540.60, margin: 45.8 },
    ]
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              لوحة تحليل الأرباح
            </h1>
            <p className="text-muted-foreground">
              تحليل شامل للإيرادات والتكاليف والأرباح
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="overview"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger 
              value="detailed"
              className={`text-base py-3 ${
                theme === 'dark' ? 'data-[state=active]:bg-blue-900/50' : 'data-[state=active]:bg-blue-100'
              }`}
            >
              تحليل تفصيلي
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Revenue Card */}
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-blue-800 bg-blue-950/30' 
                  : 'border-blue-200 bg-blue-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>إجمالي الإيرادات</span>
                    <DollarSign className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {formatCurrency(summaryData.totalRevenue)}
                  </div>
                  <div className="flex items-center text-sm">
                    {summaryData.revenueChange >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-green-500">+{summaryData.revenueChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-red-500">{summaryData.revenueChange}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground mr-1">مقارنة بالفترة السابقة</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Profit Card */}
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-green-800 bg-green-950/30' 
                  : 'border-green-200 bg-green-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>صافي الأرباح</span>
                    <BarChart3 className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {formatCurrency(summaryData.totalProfit)}
                  </div>
                  <div className="flex items-center text-sm">
                    {summaryData.profitChange >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-green-500">+{summaryData.profitChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-red-500">{summaryData.profitChange}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground mr-1">مقارنة بالفترة السابقة</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Profit Margin Card */}
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-purple-800 bg-purple-950/30' 
                  : 'border-purple-200 bg-purple-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>هامش الربح</span>
                    <span className={`text-lg ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`}>%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {summaryData.profitMargin.toFixed(1)}%
                  </div>
                  <div className="flex items-center text-sm">
                    <span className={`${
                      summaryData.profitMargin > 35 
                        ? 'text-green-500' 
                        : summaryData.profitMargin > 25 
                          ? 'text-yellow-500' 
                          : 'text-red-500'
                    }`}>
                      {summaryData.profitMargin > 35 
                        ? 'ممتاز' 
                        : summaryData.profitMargin > 25 
                          ? 'جيد' 
                          : 'منخفض'}
                    </span>
                    <span className="text-muted-foreground mr-1">نسبة الربح من الإيرادات</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Orders Card */}
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-amber-800 bg-amber-950/30' 
                  : 'border-amber-200 bg-amber-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>إجمالي الطلبات</span>
                    <ShoppingCart className={`h-5 w-5 ${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                    }`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">
                    {summaryData.totalOrders}
                  </div>
                  <div className="flex items-center text-sm">
                    {summaryData.ordersChange >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-green-500">+{summaryData.ordersChange}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-red-500">{summaryData.ordersChange}%</span>
                      </>
                    )}
                    <span className="text-muted-foreground mr-1">مقارنة بالفترة السابقة</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProfitChart />
              </div>
              
              <Card className={`border ${
                theme === 'dark' 
                  ? 'border-blue-800 bg-blue-950/30' 
                  : 'border-blue-200 bg-blue-50/50'
              }`}>
                <CardHeader>
                  <CardTitle className={`text-xl ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    أعلى المنتجات ربحاً
                  </CardTitle>
                  <CardDescription>
                    المنتجات الأكثر تحقيقاً للأرباح
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {summaryData.topProducts.map((product, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{product.name}</span>
                          <span className={`font-bold ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`}>
                            {formatCurrency(product.profit)}
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, product.margin * 2)}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>هامش الربح</span>
                          <span>{product.margin.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-0">
            <ProfitChart />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}