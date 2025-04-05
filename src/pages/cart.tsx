import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { api } from "@/lib/api";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";

export default function CartPage() {
  const { theme } = useTheme();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول للمتابعة إلى الدفع",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "أضف بعض المنتجات إلى سلتك قبل المتابعة",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create order
      const order = await api.createOrder({
        userId: useAuthStore.getState().user?.id || "",
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: calculateItemPrice(item),
        })),
        totalAmount: getTotalPrice(),
        status: "pending",
      });
      
      clearCart();
      
      toast({
        title: "تم إنشاء الطلب",
        description: "تم إنشاء طلبك بنجاح",
      });
      
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const calculateItemPrice = (item: typeof items[0]) => {
    if (item.discounts && item.discounts.length > 0) {
      const applicableDiscount = [...item.discounts]
        .sort((a, b) => b.quantity - a.quantity)
        .find(discount => item.quantity >= discount.quantity);
      
      if (applicableDiscount) {
        const discountMultiplier = 1 - applicableDiscount.percentage / 100;
        return item.price * discountMultiplier;
      }
    }
    
    return item.price;
  };
  
  const calculateItemTotal = (item: typeof items[0]) => {
    return calculateItemPrice(item) * item.quantity;
  };
  
  const handleIncreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`}>
          سلة التسوق
        </h1>
        
        {items.length === 0 ? (
          <Card className={`p-8 text-center ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
            <div className="flex flex-col items-center gap-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">سلة التسوق فارغة</h2>
              <p className="text-muted-foreground mb-4">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد.</p>
              <Link to="/categories">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  متابعة التسوق
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className={`${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                <CardContent className="p-6">
                  {items.map((item) => (
                    <div key={item.id} className="py-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-24 h-24 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <Link to={`/products/${item.id}`}>
                            <h3 className="font-medium text-lg hover:underline">{item.name}</h3>
                          </Link>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-2">
                            <div className="flex items-center border rounded-md">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => handleDecreaseQuantity(item.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 h-8 text-center border-0 rounded-none"
                              />
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => handleIncreaseQuantity(item.id)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                                ${calculateItemPrice(item).toFixed(2)}
                              </span>
                              
                              {item.discounts && item.discounts.length > 0 && item.quantity >= item.discounts[0].quantity && (
                                <span className="text-sm line-through text-muted-foreground">
                                  ${item.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {item.discounts && item.discounts.length > 0 && (
                            <div className="mt-2 text-sm">
                              <span className={`${theme === "dark" ? "text-pink-400" : "text-pink-600"}`}>خصومات الكمية: </span>
                              {item.discounts.map((discount, index) => (
                                <span key={index} className={`${
                                  item.quantity >= discount.quantity 
                                    ? theme === "dark" ? "text-green-400" : "text-green-600" 
                                    : "text-muted-foreground"
                                } ${index > 0 ? "mr-2" : ""}`}>
                                  {discount.quantity}+ ({discount.percentage}% خصم)
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold">
                            ${calculateItemTotal(item).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className={`${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">ملخص الطلب</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المجموع الفرعي:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الشحن:</span>
                      <span>مجاني</span>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between font-bold">
                      <span>المجموع:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full mt-6 ${
                      theme === "dark" 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={handleCheckout}
                    disabled={isProcessing || items.length === 0}
                  >
                    {isProcessing ? "جاري المعالجة..." : "إتمام الطلب"}
                  </Button>
                  
                  <div className="mt-4">
                    <Link to="/categories">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        متابعة التسوق
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}