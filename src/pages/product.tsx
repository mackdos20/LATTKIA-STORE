import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useCartStore } from "@/lib/stores/cart-store";
import { useTheme } from "@/components/layout/theme-provider";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/db-types";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { theme } = useTheme();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;
        
        const fetchedProduct = await api.getProductById(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id || "",
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      discounts: product.discounts,
    });
    
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة ${product.name} إلى سلة التسوق`,
    });
  };
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const getDiscountedPrice = () => {
    if (!product || !product.discounts) return product?.price;
    
    const applicableDiscount = [...product.discounts]
      .sort((a, b) => b.quantity - a.quantity)
      .find(discount => quantity >= discount.quantity);
    
    if (applicableDiscount) {
      return product.price * (1 - applicableDiscount.percentage / 100);
    }
    
    return product.price;
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Link to="/categories">
            <Button>العودة إلى التسوق</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/categories/${product.categoryId}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              العودة إلى التسوق
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className={`overflow-hidden ${theme === "dark" ? "bg-slate-900" : "bg-white"} p-4`}>
            <div className="aspect-square overflow-hidden rounded-md">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
                  ${getDiscountedPrice()?.toFixed(2)}
                </span>
                
                {product.discounts && product.discounts.length > 0 && quantity >= product.discounts[0].quantity && (
                  <span className="text-lg line-through text-muted-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">الوصف</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
            
            {product.discounts && product.discounts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">خصومات الكمية</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {product.discounts.map((discount, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border ${
                        quantity >= discount.quantity 
                          ? theme === "dark" 
                            ? "border-green-600 bg-green-900/20" 
                            : "border-green-500 bg-green-50"
                          : ""
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {discount.quantity}+ قطعة
                      </div>
                      <div className={`text-lg font-bold ${
                        quantity >= discount.quantity 
                          ? theme === "dark" ? "text-green-400" : "text-green-600" 
                          : ""
                      }`}>
                        خصم {discount.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-semibold mb-2">الكمية</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-r-none"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-12 h-10 flex items-center justify-center text-center">
                    {quantity}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-l-none"
                    onClick={increaseQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className={`w-full ${
                theme === "dark" 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              إضافة إلى السلة
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}