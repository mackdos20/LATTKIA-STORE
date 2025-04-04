import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useThemeStore } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, DollarSign, Tag, Percent } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

type ProductFormProps = {
  productId?: string;
  onSuccess?: () => void;
};

export function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const { theme } = useThemeStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    purchasePrice: "", // Price paid to supplier (cost)
    stock: "",
    sku: "",
    featured: false,
    image: null as File | null,
    discounts: [] as { quantity: string; percentage: string }[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real app, you would fetch categories from your API
        // const categoriesData = await api.getCategories();
        
        // Mock data
        const mockCategories: Category[] = [
          { id: "1", name: "شواحن" },
          { id: "2", name: "سماعات" },
          { id: "3", name: "كفرات حماية" },
          { id: "4", name: "اكسسوارات" },
        ];
        
        setCategories(mockCategories);
        
        // Mock subcategories
        const mockSubcategories: Subcategory[] = [
          { id: "1", name: "شواحن سامسونج", categoryId: "1" },
          { id: "2", name: "شواحن آيفون", categoryId: "1" },
          { id: "3", name: "شواحن سريعة", categoryId: "1" },
          { id: "4", name: "سماعات سلكية", categoryId: "2" },
          { id: "5", name: "سماعات بلوتوث", categoryId: "2" },
          { id: "6", name: "كفرات آيفون", categoryId: "3" },
          { id: "7", name: "كفرات سامسونج", categoryId: "3" },
          { id: "8", name: "حوامل هواتف", categoryId: "4" },
          { id: "9", name: "بطاريات خارجية", categoryId: "4" },
        ];
        
        setSubcategories(mockSubcategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    const fetchProductData = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        // In a real app, you would fetch product data from your API
        // const productData = await api.getProduct(productId);
        
        // Mock data for editing
        const mockProduct = {
          id: productId,
          name: "شاحن سامسونج سريع",
          description: "شاحن سامسونج سريع بقوة 25 واط، متوافق مع جميع هواتف سامسونج الحديثة.",
          categoryId: "1",
          subcategoryId: "3",
          price: "25",
          purchasePrice: "15", // Cost price
          stock: "50",
          sku: "SAMS-FAST-25W",
          featured: true,
          imageUrl: "https://example.com/images/samsung-charger.jpg",
          discounts: [
            { quantity: "10", percentage: "5" },
            { quantity: "20", percentage: "10" },
            { quantity: "50", percentage: "15" },
          ],
        };
        
        setFormData({
          name: mockProduct.name,
          description: mockProduct.description,
          categoryId: mockProduct.categoryId,
          subcategoryId: mockProduct.subcategoryId,
          price: mockProduct.price,
          purchasePrice: mockProduct.purchasePrice,
          stock: mockProduct.stock,
          sku: mockProduct.sku,
          featured: mockProduct.featured,
          image: null,
          discounts: mockProduct.discounts,
        });
        
        setImagePreview(mockProduct.imageUrl);
        
        // Filter subcategories based on selected category
        filterSubcategories(mockProduct.categoryId);
        
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات المنتج",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
    fetchProductData();
  }, [productId, toast]);

  const filterSubcategories = (categoryId: string) => {
    const filtered = subcategories.filter(sub => sub.categoryId === categoryId);
    setFilteredSubcategories(filtered);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // If category changed, filter subcategories and reset subcategory selection
    if (name === 'categoryId') {
      filterSubcategories(value);
      setFormData(prev => ({ ...prev, subcategoryId: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "يرجى اختيار صورة بتنسيق JPEG أو PNG أو WebP" }));
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت" }));
      return;
    }
    
    setFormData(prev => ({ ...prev, image: file }));
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const addDiscountTier = () => {
    setFormData(prev => ({
      ...prev,
      discounts: [...prev.discounts, { quantity: "", percentage: "" }]
    }));
  };

  const removeDiscountTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      discounts: prev.discounts.filter((_, i) => i !== index)
    }));
  };

  const handleDiscountChange = (index: number, field: 'quantity' | 'percentage', value: string) => {
    setFormData(prev => {
      const newDiscounts = [...prev.discounts];
      newDiscounts[index][field] = value;
      return { ...prev, discounts: newDiscounts };
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "اسم المنتج مطلوب";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "وصف المنتج مطلوب";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "يرجى اختيار الفئة";
    }
    
    if (!formData.subcategoryId && filteredSubcategories.length > 0) {
      newErrors.subcategoryId = "يرجى اختيار الفئة الفرعية";
    }
    
    if (!formData.price) {
      newErrors.price = "سعر المنتج مطلوب";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "يرجى إدخال سعر صحيح";
    }
    
    if (!formData.purchasePrice) {
      newErrors.purchasePrice = "سعر الشراء مطلوب";
    } else if (isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = "يرجى إدخال سعر شراء صحيح";
    }
    
    if (!formData.stock) {
      newErrors.stock = "الكمية المتوفرة مطلوبة";
    } else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "يرجى إدخال كمية صحيحة";
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = "رمز المنتج (SKU) مطلوب";
    }
    
    if (!productId && !formData.image && !imagePreview) {
      newErrors.image = "صورة المنتج مطلوبة";
    }
    
    // Validate discount tiers
    formData.discounts.forEach((discount, index) => {
      if (discount.quantity && isNaN(Number(discount.quantity))) {
        newErrors[`discount_quantity_${index}`] = "يرجى إدخال كمية صحيحة";
      }
      
      if (discount.percentage && (isNaN(Number(discount.percentage)) || Number(discount.percentage) <= 0 || Number(discount.percentage) > 100)) {
        newErrors[`discount_percentage_${index}`] = "يرجى إدخال نسبة خصم صحيحة (1-100)";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      // In a real app, you would save the product data to your API
      // const formDataToSend = new FormData();
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (key === 'image' && value) {
      //     formDataToSend.append('image', value);
      //   } else if (key === 'discounts') {
      //     formDataToSend.append('discounts', JSON.stringify(value));
      //   } else if (key === 'featured') {
      //     formDataToSend.append(key, value.toString());
      //   } else {
      //     formDataToSend.append(key, value as string);
      //   }
      // });
      
      // if (productId) {
      //   await api.updateProduct(productId, formDataToSend);
      // } else {
      //   await api.createProduct(formDataToSend);
      // }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: productId ? "تم تحديث المنتج" : "تم إضافة المنتج",
        description: productId ? "تم تحديث بيانات المنتج بنجاح" : "تم إضافة المنتج بنجاح",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ بيانات المنتج",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
            {productId ? "تحرير المنتج" : "إضافة منتج جديد"}
          </CardTitle>
          <CardDescription>
            جاري التحميل...
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
      <CardHeader>
        <CardTitle className={`text-xl ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {productId ? "تحرير المنتج" : "إضافة منتج جديد"}
        </CardTitle>
        <CardDescription>
          {productId ? "تعديل بيانات المنتج الحالي" : "إضافة منتج جديد إلى المتجر"}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit} dir="rtl">
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">اسم المنتج</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSaving}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}
                placeholder="أدخل اسم المنتج"
              />
              {errors.name && <p className="text-sm text-destructive text-right">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-right block">رمز المنتج (SKU)</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={isSaving}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}
                placeholder="مثال: SAMS-FAST-25W"
              />
              {errors.sku && <p className="text-sm text-destructive text-right">{errors.sku}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right block">وصف المنتج</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSaving}
              className={`${
                theme === 'dark' 
                  ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                  : 'bg-white border-blue-200 focus:border-blue-400'
              } text-right min-h-[100px]`}
              placeholder="أدخل وصفاً تفصيلياً للمنتج"
            />
            {errors.description && <p className="text-sm text-destructive text-right">{errors.description}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-right block">الفئة</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleSelectChange('categoryId', value)}
                disabled={isSaving}
              >
                <SelectTrigger className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700' 
                    : 'bg-white border-blue-200'
                } text-right h-11`}>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive text-right">{errors.categoryId}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subcategoryId" className="text-right block">الفئة الفرعية</Label>
              <Select
                value={formData.subcategoryId}
                onValueChange={(value) => handleSelectChange('subcategoryId', value)}
                disabled={isSaving || !formData.categoryId || filteredSubcategories.length === 0}
              >
                <SelectTrigger className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700' 
                    : 'bg-white border-blue-200'
                } text-right h-11`}>
                  <SelectValue placeholder={
                    !formData.categoryId 
                      ? "اختر الفئة أولاً" 
                      : filteredSubcategories.length === 0 
                        ? "لا توجد فئات فرعية" 
                        : "اختر الفئة الفرعية"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredSubcategories.map(subcategory => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>{subcategory.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subcategoryId && <p className="text-sm text-destructive text-right">{errors.subcategoryId}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-right block flex items-center">
                <Tag className="ml-1 h-4 w-4" />
                سعر البيع ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                disabled={isSaving}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-sm text-destructive text-right">{errors.price}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchasePrice" className="text-right block flex items-center">
                <DollarSign className="ml-1 h-4 w-4" />
                سعر الشراء ($)
                <span className={`mr-1 text-xs ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                }`}>
                  (للإدارة فقط)
                </span>
              </Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={handleChange}
                disabled={isSaving}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}
                placeholder="0.00"
              />
              {errors.purchasePrice && <p className="text-sm text-destructive text-right">{errors.purchasePrice}</p>}
              <p className="text-xs text-muted-foreground text-right">
                سعر الشراء لا يظهر للعملاء، يستخدم فقط لحساب الأرباح
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-right block">الكمية المتوفرة</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                disabled={isSaving}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}
                placeholder="0"
              />
              {errors.stock && <p className="text-sm text-destructive text-right">{errors.stock}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-right block">صورة المنتج</Label>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className={`border rounded-md overflow-hidden ${
                theme === 'dark' ? 'border-blue-700' : 'border-blue-200'
              }`}>
                {imagePreview ? (
                  <img 
                    src={imagePreview} alt="معاينة صورة المنتج" 
                    className="w-32 h-32 object-cover"
                  />
                ) : (
                  <div className={`w-32 h-32 flex items-center justify-center ${
                    theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isSaving}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  يجب أن تكون الصورة بتنسيق JPEG أو PNG أو WebP وحجم أقل من 2 ميجابايت
                </p>
                {errors.image && <p className="text-sm text-destructive text-right">{errors.image}</p>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleSwitchChange}
              disabled={isSaving}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              عرض في المنتجات المميزة
            </Label>
          </div>
          
          <Separator className={theme === 'dark' ? 'bg-blue-800' : 'bg-blue-200'} />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                خصومات الكميات
              </h3>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDiscountTier}
                disabled={isSaving}
                className={`${
                  theme === 'dark' 
                    ? 'border-blue-700 text-blue-400 hover:bg-blue-900/30' 
                    : 'border-blue-400 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Plus className="h-4 w-4 ml-1" />
                إضافة شريحة خصم
              </Button>
            </div>
            
            {formData.discounts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                لا توجد خصومات للكميات. أضف شرائح خصم للكميات الكبيرة.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.discounts.map((discount, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDiscountTier(index)}
                      disabled={isSaving}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            min="1"
                            value={discount.quantity}
                            onChange={(e) => handleDiscountChange(index, 'quantity', e.target.value)}
                            disabled={isSaving}
                            className={`${
                              theme === 'dark' 
                                ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                                : 'bg-white border-blue-200 focus:border-blue-400'
                            } text-right h-11`}
                            placeholder="الكمية"
                          />
                          <span className="mr-2">قطعة أو أكثر</span>
                        </div>
                        {errors[`discount_quantity_${index}`] && (
                          <p className="text-sm text-destructive text-right">{errors[`discount_quantity_${index}`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={discount.percentage}
                            onChange={(e) => handleDiscountChange(index, 'percentage', e.target.value)}
                            disabled={isSaving}
                            className={`${
                              theme === 'dark' 
                                ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                                : 'bg-white border-blue-200 focus:border-blue-400'
                            } text-right h-11`}
                            placeholder="نسبة الخصم"
                          />
                          <Percent className="h-4 w-4 mr-2" />
                        </div>
                        {errors[`discount_percentage_${index}`] && (
                          <p className="text-sm text-destructive text-right">{errors[`discount_percentage_${index}`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Alert className={theme === 'dark' ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}>
              <AlertDescription className="text-right">
                خصومات الكميات تطبق تلقائياً عند إضافة العميل للكمية المحددة أو أكثر من المنتج إلى سلة التسوق.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isSaving}
            className={`${
              theme === 'dark' 
                ? 'border-blue-700 text-blue-400 hover:bg-blue-900/30' 
                : 'border-blue-400 text-blue-600 hover:bg-blue-50'
            }`}
          >
            إلغاء
          </Button>
          
          <Button 
            type="submit" 
            disabled={isSaving}
            className={`h-11 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_15px_rgba(37,99,235,0.8)]'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-all duration-300`}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              productId ? "تحديث المنتج" : "إضافة المنتج"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}