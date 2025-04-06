import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Category, Product } from "@/lib/db/models";
import { useThemeStore } from "@/lib/theme";
import { motion } from "framer-motion";
import { Camera, Image, Grid, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { theme } = useThemeStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPhotos, setFeaturedPhotos] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          api.getCategories(),
          api.getFeaturedProducts(),
        ]);
        
        setCategories(categoriesData);
        setFeaturedPhotos(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="w-full min-h-screen">
        {/* Hero Section */}
        <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-blue-950 to-slate-900' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
          <div className="container mx-auto text-center">
            <motion.h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Photo Portfolio
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-muted-foreground"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Capturing moments, preserving memories
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/categories">
                <Button 
                  size="lg" 
                  className={`text-lg ${
                    theme === 'dark' 
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.6)] hover:shadow-[0_0_20px_rgba(37,99,235,0.8)]' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } transition-all duration-300`}
                >
                  Browse Gallery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              Photography Categories
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className={`h-64 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} animate-pulse`} />
                ))
              ) : (
                categories.map((category) => (
                  <Link to={`/categories/${category.id}`} key={category.id}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={`h-64 overflow-hidden border ${
                        theme === 'dark' 
                          ? 'border-blue-800 bg-blue-900/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                          : 'border-blue-200 hover:shadow-lg'
                      } transition-all duration-300`}>
                        <div className="relative h-full">
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                            <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
        
        {/* Featured Photos */}
        <section className={`py-12 px-4 ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto">
            <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              Featured Photos
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <Card key={index} className={`h-80 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'} animate-pulse`} />
                ))
              ) : (
                featuredPhotos.map((photo) => (
                  <motion.div
                    key={photo.id}
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
                        <Link to={`/products/${photo.id}`} className="block h-48 overflow-hidden">
                          <img 
                            src={photo.image} 
                            alt={photo.name} 
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </Link>
                        
                        <div className="p-4 flex flex-col flex-grow">
                          <Link to={`/products/${photo.id}`} className="block mb-2">
                            <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                              {photo.name}
                            </h3>
                          </Link>
                          
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {photo.description}
                          </p>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <span className={`font-bold text-lg ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                              ${photo.price}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/categories">
                <Button 
                  variant="outline" 
                  size="lg"
                  className={`${
                    theme === 'dark' 
                      ? 'border-blue-600 text-blue-400 hover:bg-blue-900/30' 
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  } transition-all duration-300`}
                >
                  View All Photos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              About the Photographer
            </h2>
            
            <p className="text-lg mb-8 text-muted-foreground">
              I'm a passionate photographer with over 10 years of experience capturing life's most beautiful moments. 
              My work focuses on finding beauty in both natural landscapes and urban environments.
            </p>
            
            <div className="flex justify-center space-x-6">
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <Camera className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <span className="text-sm text-muted-foreground">Professional Equipment</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <Image className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <span className="text-sm text-muted-foreground">High Resolution</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                  theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
                }`}>
                  <Grid className={`h-8 w-8 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <span className="text-sm text-muted-foreground">Various Styles</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;