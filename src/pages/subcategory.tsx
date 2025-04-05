import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useCartStore } from "@/lib/stores/cart-store";
import { useTheme } from "@/components/layout/theme-provider";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product, Subcategory } from "@/lib/db-types";

export default function SubcategoryPage() {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!subcategoryId) return;
        
        // In a real app, we would fetch the subcategory details
        // const fetchedSubcategory = await api.getSubcategoryById(subcategoryId);
        
        // For now, we'll use mock data
        const allSubcategories = await api.getSubcategories();
        const fetchedSubcategory = allSubcategories.find(sub => sub.id === subcategoryId) || null;
        
        setSubcategory(fetchedSubcategory);
        
        if (fetchedSubcategory) {
          const fetchedProducts = await api.getProducts(subcategoryId);
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [subcategoryId]);
  
  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id || "",
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      discounts: product.discounts,
    });
    
    toast({
      title: "تمت الإضافة إلى السلة",
      description: `تمت إضافة ${product.name} إلى سلة التسوق`,
    });
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-1/3 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <Card key={index} className={`h-80 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} animate-pulse`} />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!subcategory) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">الفئة الفرعية غير موجودة</h1>
          <Link to="/categories">
            <Button>العودة إلى التصنيفات</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={`/categories/${subcategory.categoryId}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              العودة إلى الفئة
            </Button>
          </Link>
        </div>
        
        <h1 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          {subcategory.name}
        </h1>
        
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">لا توجد منتجات في هذه الفئة الفرعية.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: theme === 'dark' 
                    ? '0 0 20px rgba(59, 130, 246, 0.5)' 
                    : '0 10px 25px rgba(0, 0, 0, 0.1)' 
                }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`h-full overflow-hidden border ${
                  theme === 'dark' 
                    ? 'border-blue-800 bg-blue-900/20' 
                    : 'border-blue-200'
                } transition-all duration-300`}>
                  <CardContent className="p-0 flex flex-col h-full">
                    <Link to={`/products/${product.id}`} className="block h-48 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </Link>
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <Link to={`/products/${product.id}`} className="block mb-2">
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                          {product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <span className={`font-bold text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                          ${product.price}
                        </span>
                        
                        <Button 
                          size="sm" 
                          onClick={() => handleAddToCart(product)}
                          className={`${
                            theme === 'dark' 
                              ? 'bg-pink-600 hover:bg-pink-700 shadow-[0_0_10px_rgba(219,39,119,0.5)] hover:shadow-[0_0_15px_rgba(219,39,119,0.7)]' 
                              : 'bg-pink-600 hover:bg-pink-700'
                          } transition-all duration-300`}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          أضف للسلة
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}