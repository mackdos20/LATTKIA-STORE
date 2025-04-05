import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/route-components";
import type { Category, Subcategory } from "@/lib/db-types";

function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("categories");
  
  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    id: "",
    name: "",
    image: "",
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  
  // Subcategory dialog state
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    id: "",
    name: "",
    categoryId: "",
    image: "",
  });
  const [isEditingSubcategory, setIsEditingSubcategory] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          api.getCategories(),
          api.getSubcategories(),
        ]);
        
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load categories data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  // Category handlers
  const handleOpenCategoryDialog = (category?: Category) => {
    if (category) {
      setCategoryFormData({
        id: category.id || "",
        name: category.name,
        image: category.image,
      });
      setIsEditingCategory(true);
    } else {
      setCategoryFormData({
        id: "",
        name: "",
        image: "",
      });
      setIsEditingCategory(false);
    }
    setCategoryDialogOpen(true);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditingCategory) {
        // Update existing category
        const updatedCategory = await api.updateCategory(categoryFormData.id, {
          name: categoryFormData.name,
          image: categoryFormData.image,
        });
        
        setCategories(prev => 
          prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
        );
        
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        // Create new category
        const newCategory = await api.createCategory({
          name: categoryFormData.name,
          image: categoryFormData.image,
          slug: categoryFormData.name.toLowerCase().replace(/\s+/g, '-'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        setCategories(prev => [...prev, newCategory]);
        
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
      
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? This will also delete all subcategories and products within it.")) {
      return;
    }
    
    try {
      await api.deleteCategory(id);
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setSubcategories(prev => prev.filter(sub => sub.categoryId !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };
  
  // Subcategory handlers
  const handleOpenSubcategoryDialog = (subcategory?: Subcategory) => {
    if (subcategory) {
      setSubcategoryFormData({
        id: subcategory.id || "",
        name: subcategory.name,
        categoryId: subcategory.categoryId,
        image: subcategory.image,
      });
      setIsEditingSubcategory(true);
    } else {
      setSubcategoryFormData({
        id: "",
        name: "",
        categoryId: categories.length > 0 ? categories[0].id || "" : "",
        image: "",
      });
      setIsEditingSubcategory(false);
    }
    setSubcategoryDialogOpen(true);
  };
  
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubcategoryFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditingSubcategory) {
        // Update existing subcategory
        // In a real app, we would have an API endpoint for this
        // For now, we'll just update our local state
        
        const updatedSubcategory: Subcategory = {
          id: subcategoryFormData.id,
          name: subcategoryFormData.name,
          categoryId: subcategoryFormData.categoryId,
          image: subcategoryFormData.image,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setSubcategories(prev => 
          prev.map(sub => sub.id === updatedSubcategory.id ? updatedSubcategory : sub)
        );
        
        toast({
          title: "Success",
          description: "Subcategory updated successfully",
        });
      } else {
        // Create new subcategory
        const newSubcategory = await api.createSubcategory({
          name: subcategoryFormData.name,
          categoryId: subcategoryFormData.categoryId,
          image: subcategoryFormData.image,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        setSubcategories(prev => [...prev, newSubcategory]);
        
        toast({
          title: "Success",
          description: "Subcategory created successfully",
        });
      }
      
      setSubcategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to save subcategory",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSubcategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subcategory? This will also delete all products within it.")) {
      return;
    }
    
    try {
      // In a real app, we would have an API endpoint for this
      // For now, we'll just update our local state
      setSubcategories(prev => prev.filter(sub => sub.id !== id));
      
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to delete subcategory",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">إدارة الفئات</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="categories">الفئات الرئيسية</TabsTrigger>
            <TabsTrigger value="subcategories">الفئات الفرعية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">الفئات الرئيسية</h2>
              <Button onClick={() => handleOpenCategoryDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                إضافة فئة جديدة
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="h-64 animate-pulse" />
                ))
              ) : categories.length === 0 ? (
                <p className="col-span-full text-center py-10 text-muted-foreground">
                  لا توجد فئات. أضف فئة جديدة للبدء.
                </p>
              ) : (
                categories.map((category) => (
                  <Card key={category.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                          onClick={() => handleOpenCategoryDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="h-8 w-8 rounded-full bg-white/80 hover:bg-red-500 hover:text-white"
                          onClick={() => handleDeleteCategory(category.id || "")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subcategories.filter(sub => sub.categoryId === category.id).length} فئات فرعية
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="subcategories">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">الفئات الفرعية</h2>
              <Button 
                onClick={() => handleOpenSubcategoryDialog()}
                disabled={categories.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                إضافة فئة فرعية جديدة
              </Button>
            </div>
            
            {categories.length === 0 ? (
              <p className="text-center py-10 text-muted-foreground">
                أضف فئة رئيسية أولاً قبل إضافة الفئات الفرعية.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array(3).fill(0).map((_, index) => (
                    <Card key={index} className="h-64 animate-pulse" />
                  ))
                ) : subcategories.length === 0 ? (
                  <p className="col-span-full text-center py-10 text-muted-foreground">
                    لا توجد فئات فرعية. أضف فئة فرعية جديدة للبدء.
                  </p>
                ) : (
                  subcategories.map((subcategory) => {
                    const parentCategory = categories.find(cat => cat.id === subcategory.categoryId);
                    
                    return (
                      <Card key={subcategory.id} className="overflow-hidden">
                        <div className="relative h-40">
                          <img 
                            src={subcategory.image} 
                            alt={subcategory.name} 
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Button 
                              size="icon" 
                              variant="secondary" 
                              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                              onClick={() => handleOpenSubcategoryDialog(subcategory)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="destructive" 
                              className="h-8 w-8 rounded-full bg-white/80 hover:bg-red-500 hover:text-white"
                              onClick={() => handleDeleteSubcategory(subcategory.id || "")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg">{subcategory.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {parentCategory ? `ضمن: ${parentCategory.name}` : "فئة غير معروفة"}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الفئة</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={categoryFormData.name} 
                  onChange={handleCategoryChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">رابط الصورة</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={categoryFormData.image} 
                  onChange={handleCategoryChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {isEditingCategory ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditingSubcategory ? "تعديل الفئة الفرعية" : "إضافة فئة فرعية جديدة"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubcategorySubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الفئة الفرعية</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={subcategoryFormData.name} 
                  onChange={handleSubcategoryChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">الفئة الرئيسية</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={subcategoryFormData.categoryId}
                  onChange={handleSubcategoryChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">رابط الصورة</Label>
                <Input 
                  id="image" 
                  name="image" 
                  value={subcategoryFormData.image} 
                  onChange={handleSubcategoryChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSubcategoryDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                {isEditingSubcategory ? "تحديث" : "إضافة"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export default function ProtectedAdminCategoriesPage() {
  return <ProtectedRoute Component={AdminCategoriesPage} />;
}