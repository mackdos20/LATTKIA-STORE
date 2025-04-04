import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useThemeStore } from "@/lib/theme";
import { Product, Category } from "@/lib/db/models";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (product: Partial<Product>) => Promise<void>;
  isLoading: boolean;
}

export function ProductForm({ product, categories, onSubmit, isLoading }: ProductFormProps) {
  const { theme } = useThemeStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      description: "",
      price: 0,
      costPrice: 0, // سعر الشراء
      image: "",
      images: [],
      categoryId: "",
      stock: 0,
      minStock: 10,
      sku: "",
      featured: false,
      discounts: []
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newDiscount, setNewDiscount] = useState({ quantity: 5, percentage: 10 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDiscount((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addDiscount = () => {
    if (newDiscount.quantity <= 0 || newDiscount.percentage <= 0 || newDiscount.percentage > 100) {
      toast({
        title: "خطأ في الخصم",
        description: "يرجى التأكد من صحة قيم الخصم",
        variant: "destructive",
      });
      return;
    }
    
    const discounts = [...(formData.discounts || [])];
    
    // التحقق من عدم وجود خصم بنفس الكمية
    const existingIndex = discounts.findIndex(d => d.quantity === newDiscount.quantity);
    if (existingIndex >= 0) {
      discounts[existingIndex] = { ...newDiscount };
    } else {
      discounts.push({ ...newDiscount });
      // ترتيب الخصومات حسب الكمية
      discounts.sort((a, b) => a.quantity - b.quantity);
    }
    
    setFormData(prev => ({ ...prev, discounts }));
    setNewDiscount({ quantity: 5, percentage: 10 });
  };

  const removeDiscount = (index: number) => {
    const discounts = [...(formData.discounts || [])];
    discounts.splice(index, 1);
    setFormData(prev => ({ ...prev, discounts }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "اسم المنتج مطلوب";
    }

    if (!formData.description) {
      newErrors.description = "وصف المنتج مطلوب";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "سعر البيع يجب أن يكون أكبر من صفر";
    }

    if (!formData.costPrice || formData.costPrice <= 0) {
      newErrors.costPrice = "سعر الشراء يجب أن يكون أكبر من صفر";
    }

    if (formData.costPrice && formData.price && formData.costPrice >= formData.price) {
      newErrors.costPrice = "سعر الشراء يجب أن يكون أقل من سعر البيع";
    }

    if (!formData.image) {
      newErrors.image = "صورة المنتج مطلوبة";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "فئة المنتج مطلوبة";
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "المخزون يجب أن يكون صفر أو أكبر";
    }

    if (!formData.sku) {
      newErrors.sku = "رمز المنتج (SKU) مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive",
      });
    }
  };

  // تنسيق الأرقام بالعملة
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

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
          {product ? "تعديل المنتج" : "إضافة منتج جديد"}
        </CardTitle>
        <CardDescription>
          {product ? "تعديل بيانات المنتج الحالي" : "إضافة منتج جديد إلى المتجر"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} dir="rtl">
        <CardContent className="space-y-6">
          {/* معلومات المنتج الأساسية */}
          <div className="space-y-4">
            <h3 className={`text-lg font-medium ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              المعلومات الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block">اسم المنتج</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
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
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل رمز المنتج"
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
                disabled={isLoading}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right min-h-[100px]`}
                placeholder="أدخل وصف المنتج"
              />
              {errors.description && <p className="text-sm text-destructive text-right">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId" className="text-right block">فئة المنتج</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleSelectChange("categoryId", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}>
                  <SelectValue placeholder="اختر فئة المنتج" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-sm text-destructive text-right">{errors.categoryId}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image" className="text-right block">رابط صورة المنتج</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={isLoading}
                className={`${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                    : 'bg-white border-blue-200 focus:border-blue-400'
                } text-right h-11`}
                placeholder="أدخل رابط صورة المنتج"
              />
              {errors.image && <p className="text-sm text-destructive text-right">{errors.image}</p>}
            </div>
          </div>
          
          {/* معلومات الأسعار والمخزون */}
          <div className="space-y-4 pt-4">
            <h3 className={`text-lg font-medium ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              الأسعار والمخزون
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-right block">سعر البيع ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleNumberChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل سعر البيع"
                />
                {errors.price && <p className="text-sm text-destructive text-right">{errors.price}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="costPrice" className="text-right block">سعر الشراء ($)</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={handleNumberChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل سعر الشراء"
                />
                {errors.costPrice && <p className="text-sm text-destructive text-right">{errors.costPrice}</p>}
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-500">*</span> سعر الشراء يظهر فقط للمدير ويستخدم لحساب الأرباح
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-right block">المخزون</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={handleNumberChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل كمية المخزون"
                />
                {errors.stock && <p className="text-sm text-destructive text-right">{errors.stock}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStock" className="text-right block">الحد الأدنى للمخزون</Label>
                <Input
                  id="minStock"
                  name="minStock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.minStock}
                  onChange={handleNumberChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل الحد الأدنى للمخزون"
                />
                <p className="text-xs text-muted-foreground">
                  سيتم إرسال تنبيه عندما ينخفض المخزون عن هذا الحد
                </p>
              </div>
              
              <div className="space-y-2 flex items-center">
                <div className="flex-1">
                  <Label htmlFor="featured" className="text-right block mb-2">منتج مميز</Label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      {formData.featured ? "نعم" : "لا"}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    المنتجات المميزة تظهر في الصفحة الرئيسية
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* خصومات الجملة */}
          <div className="space-y-4 pt-4">
            <h3 className={`text-lg font-medium ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              خصومات الجملة
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="discountQuantity" className="text-right block">الكمية</Label>
                <Input
                  id="discountQuantity"
                  name="quantity"
                  type="number"
                  min="2"
                  step="1"
                  value={newDiscount.quantity}
                  onChange={handleDiscountChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل الكمية"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountPercentage" className="text-right block">نسبة الخصم (%)</Label>
                <Input
                  id="discountPercentage"
                  name="percentage"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={newDiscount.percentage}
                  onChange={handleDiscountChange}
                  disabled={isLoading}
                  className={`${
                    theme === 'dark' 
                      ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500' 
                      : 'bg-white border-blue-200 focus:border-blue-400'
                  } text-right h-11`}
                  placeholder="أدخل نسبة الخصم"
                />
              </div>
              
              <Button
                type="button"
                onClick={addDiscount}
                disabled={isLoading}
                className={`h-11 ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <Plus className="ml-2 h-4 w-4" />
                إضافة خصم
              </Button>
            </div>
            
            {/* قائمة الخصومات */}
            {formData.discounts && formData.discounts.length > 0 ? (
              <div className={`rounded-md border ${
                theme === 'dark' ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
              } p-4`}>
                <h4 className="font-medium mb-2">الخصومات المضافة:</h4>
                <div className="space-y-2">
                  {formData.discounts.map((discount, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2 rounded-md ${
                        theme === 'dark' ? 'bg-blue-950/50' : 'bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-medium">عند شراء {discount.quantity} قطعة أو أكثر: </span>
                        <span className={`${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          خصم {discount.percentage}%
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDiscount(index)}
                        disabled={isLoading}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                لم يتم إضافة أي خصومات بعد. أضف خصومات للكميات الكبيرة لتشجيع مبيعات الجملة.
              </p>
            )}
          </div>
          
          {/* ملخص المنتج */}
          <div className={`rounded-md border ${
            theme === 'dark' ? 'border-blue-800 bg-blue-900/20' : 'border-blue-200 bg-blue-50'
          } p-4 mt-6`}>
            <h3 className={`text-lg font-medium mb-4 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              ملخص المنتج
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm mb-1">
                  <span className="font-medium">سعر البيع:</span> {formatCurrency(formData.price || 0)}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">سعر الشراء:</span> {formatCurrency(formData.costPrice || 0)}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">هامش الربح:</span> {
                    formData.price && formData.costPrice 
                      ? `${Math.round(((formData.price - formData.costPrice) / formData.price) * 100)}%`
                      : "غير محدد"
                  }
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">الربح لكل قطعة:</span> {
                    formData.price && formData.costPrice 
                      ? formatCurrency(formData.price - formData.costPrice)
                      : "غير محدد"
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm mb-1">
                  <span className="font-medium">المخزون الحالي:</span> {formData.stock || 0} قطعة
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">الحد الأدنى للمخزون:</span>{formData.minStock || 0} قطعة
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">حالة المخزون:</span> {
                    formData.stock && formData.minStock
                      ? formData.stock > formData.minStock
                        ? <span className="text-green-500">متوفر</span>
                        : <span className="text-yellow-500">منخفض</span>
                      : <span className="text-red-500">غير متوفر</span>
                  }
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">منتج مميز:</span> {formData.featured ? "نعم" : "لا"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className={`w-full h-11 ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              product ? "تحديث المنتج" : "إضافة المنتج"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}