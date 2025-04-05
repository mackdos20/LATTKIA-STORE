import { Header } from "@/components/layout/Header";
import { PhotoDetail } from "@/components/PhotoDetail";

export default function PhotoDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <PhotoDetail />
      </main>
    </div>
  );
}