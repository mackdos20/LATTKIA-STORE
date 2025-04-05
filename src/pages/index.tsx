import { MainLayout } from "@/components/layout/MainLayout";
import { PhotoGrid } from "@/components/PhotoGrid";
import { useTheme } from "@/components/layout/theme-provider";
import { motion } from "framer-motion";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <MainLayout>
      <div className="w-full min-h-screen">
        {/* Hero Section */}
        <section className={`py-12 px-4 ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-slate-100 to-white'}`}>
          <div className="container mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Photo Portfolio
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Capturing moments and memories through the lens
            </motion.p>
          </div>
        </section>
        
        {/* Gallery Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Gallery
            </h2>
            
            <PhotoGrid />
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;