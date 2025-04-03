import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { Order } from "@/lib/db/models";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { format } from "date-fns";
import { ArrowLeft, Clock, Package, ShoppingBag, Truck } from "lucide-react";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        const data = await api.getOrderById(id);
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <ShoppingBag className="h-5 w-5 text-green-500" />;
      case 'shipping':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <Package className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'بانتظار المراجعة';
      case 'approved':
        return 'تمت الموافقة';
      case 'shipping':
        return 'قيد التوصيل';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'تم الإلغاء';
      default:
        return 'بانتظار المراجعة';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
      case 'shipping':
        return theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700';
      case 'delivered':
        return theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700';
      case 'cancelled':
        return theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700';
      default:
        return theme === 'dark' ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700';
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-16 text-center">
          <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
            يرجى تسجيل الدخول
          </h1>
          <p className="text-muted-foreground mb-8">
            يجب عليك تسجيل الدخول لعرض تفاصيل الطلب
          </p>
          <Link to="/login">
            <Button 
              className={`${
                theme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-all duration-300`}
            >
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to="/orders">
            <Button 
              variant="outline" 
              className={`${
                theme === 'dark' 
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              } transition-all duration-300`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة إلى الطلبات
            </Button>
          </Link>
        </div>
        
        <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          تفاصيل الطلب
        </h1>
        
        {isLoading ? (
          <Card className={`${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} animate-pulse h-96`} />
        ) : order ? (
          <Card 
            className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            } transition-all duration-300`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  طلب #{order.id.substring(order.id.length - 6)}
                </CardTitle>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="mr-1">{getStatusText(order.status)}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                تاريخ الطلب: {format(new Date(order.createdAt), 'dd/MM/yyyy')}
              </div>
              {order.expectedDeliveryTime && (
                <div className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  وقت التسليم المتوقع: {format(new Date(order.expectedDeliveryTime), 'dd/MM/yyyy')}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    المنتجات
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div 
                        key={item.id} 
                        className={`p-4 rounded-lg ${
                          theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="ml-4 flex-grow">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.product.description}</p>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </div>
                            <div className={`font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">المجموع:</h3>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    ${order.total.toFixed(2)}
                  </div>
                </div>
                
                {order.status === 'pending' && (
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    <p className="text-center">
                      طلبك قيد المراجعة. سيتم إشعارك عند تحديث حالة الطلب.
                    </p>
                  </div>
                )}
                
                {order.status === 'shipping' && order.expectedDeliveryTime && (
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700'
                  }`}>
                    <p className="text-center flex items-center justify-center">
                      <Truck className="h-5 w-5 mr-2" />
                      طلبك قيد التوصيل. وقت التسليم المتوقع: {format(new Date(order.expectedDeliveryTime), 'dd/MM/yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className={`h-16 w-16 mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className="text-2xl font-medium mb-4">الطلب غير موجود</h2>
            <p className="text-muted-foreground mb-8">لم يتم العثور على الطلب المطلوب</p>
            
            <Link to="/orders">
              <Button 
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition-all duration-300`}
              >
                العودة إلى الطلبات
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrderDetailsPage;