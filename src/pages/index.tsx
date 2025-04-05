import { Header } from "@/components/layout/Header";
import { PhotoGrid } from "@/components/PhotoGrid";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Photo Gallery</h1>
        <PhotoGrid />
      </main>
    </div>
  );
};

export default Index;