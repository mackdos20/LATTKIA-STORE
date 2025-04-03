import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/lib/theme";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, X, ArrowUp, ArrowDown } from "lucide-react";

// نفترض أن هذه الإعدادات ستكون مخزنة في مكان ما (في الحالة الحقيقية ستكون في قاعدة البيانات)
const defaultMarqueeItems = [
  "🔥 عروض حصرية على شواحن سامسونج - خصم 15% عند شراء 50 قطعة أو أكثر!",
  "🎧 سماعات بلوتوث لاسلكية - خصم 20% على الكميات!",
  "📱 كفرات حماية لجميع الموديلات - اطلب الآن!",
  "🚚 توصيل مجاني للطلبات فوق 500 دولار!"
];

const AdminMarquee = () => {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [marqueeItems, setMarqueeItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [speed, setSpeed] = useState("30");
  
  useEffect(() => {
    const fetchMarqueeItems = async () => {
      try {
        // في الحالة الحقيقية، سنقوم بجلب العناصر من الخادم
        // لكن هنا سنستخدم localStorage للمحاكاة
        const savedItems = localStorage.getItem('marqueeItems');
        const savedSpeed = localStorage.getItem('marqueeSpeed');
        
        if (savedItems) {
          setMarqueeItems(JSON.parse(savedItems));
        } else {
          setMarqueeItems(defaultMarqueeItems);
        }
        
        if (savedSpeed) {
          setSpeed(savedSpeed);
        }
      } catch (error) {
        console.error("Error fetching marquee items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarqueeItems();
  }, []);
  
  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    setMarqueeItems(prev => [...prev, newItem]);
    setNewItem("");
  };
  
  const handleRemoveItem = (index: number) => {
    setMarqueeItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    setMarqueeItems(prev => {
      const newItems = [...prev];
      const temp = newItems[index];
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = temp;
      return newItems;
    });
  };
  
  const handleMoveDown = (index: number) => {
    if (index === marqueeItems.length - 1) return;
    
    setMarqueeItems(prev => {
      const newItems = [...prev];
      const temp = newItems[index];
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = temp;
      return newItems;
    });
  };
  
  const saveMarqueeItems = async () => {
    setIsSaving(true);
    
    try {
      // في الحالة الحقيقية، سنقوم بإرسال العناصر إلى الخادم
      // لكن هنا سنستخدم localStorage للمحاكاة
      localStorage.setItem('marqueeItems', JSON.stringify(marqueeItems));
      localStorage.setItem('marqueeSpeed', speed);
      
      // تحديث CSS للشريط المتحرك
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .marquee-content {
          animation: marquee ${speed}s linear infinite;
        }
      `;
      
      // إزالة أي عنصر style سابق
      const oldStyle = document.getElementById('marquee-style');
      if (oldStyle) {
        oldStyle.remove();
      }
      
      // إضافة عنصر style الجديد
      styleElement.id = 'marquee-style';
      document.head.appendChild(styleElement);
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات الشريط المتحرك بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ إعدادات الشريط المتحرك",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
          إدارة الشريط المتحرك
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  عناصر الشريط المتحرك
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-6" dir="rtl">
                    <div className="flex gap-2">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="أدخل نص جديد للشريط المتحرك"
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                            : 'bg-white border-blue-200 focus:border-blue-400'
                        } text-right`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddItem();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddItem}
                        disabled={!newItem.trim()}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {marqueeItems.length > 0 ? (
                        marqueeItems.map((item, index) => (
                          <div 
                            key={index} 
                            className={`p-4 rounded-lg flex items-center justify-between ${
                              theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                            }`}
                          >
                            <div className="flex-grow text-right">{item}</div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                                className={`${
                                  theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100'
                                }`}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleMoveDown(index)}
                                disabled={index === marqueeItems.length - 1}
                                className={`${
                                  theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100'
                                }`}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveItem(index)}
                                className={`${
                                  theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                                }`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-4">
                          لا توجد عناصر في الشريط المتحرك. أضف عناصر جديدة باستخدام الحقل أعلاه.
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={saveMarqueeItems}
                        disabled={isSaving}
                        className={`${
                          theme === 'dark' 
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_rgba(37,99,235,0.7)]' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } transition-all duration-300`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            حفظ التغييرات
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className={`border ${
              theme === 'dark' ? 'border-blue-800 bg-blue-950/30' : 'border-blue-200'
            }`}>
              <CardHeader>
                <CardTitle className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                  إعدادات الشريط المتحرك
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6" dir="rtl">
                  <div className="space-y-2">
                    <Label htmlFor="speed" className="text-right block">سرعة الشريط المتحرك (ثواني)</Label>
                    <Input
                      id="speed"
                      type="number"
                      min="5"
                      max="60"
                      value={speed}
                      onChange={(e) => setSpeed(e.target.value)}
                      className={`${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 border-blue-700 focus:border-blue-500 focus:ring-blue-500/50' 
                          : 'bg-white border-blue-200 focus:border-blue-400'
                      } text-right`}
                    />
                    <p className="text-xs text-muted-foreground">
                      كلما كان الرقم أكبر، كلما كان الشريط أبطأ.
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                  }`}>
                    <h3 className="font-bold mb-2 text-right">معاينة الشريط المتحرك:</h3>
                    <div className={`py-3 ${theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-100'} overflow-hidden rounded-lg`}>
                      <div className="marquee-container">
                        <div className="marquee-content">
                          {marqueeItems.map((item, index) => (
                            <span key={index} className={`text-lg font-medium ${theme === 'dark' ? 'text-pink-300' : 'text-pink-600'} px-4`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminMarquee;