import { Header } from "@/components/layout/Header";
import { PhotoDetail } from "@/components/PhotoDetail";

export default function PhotoDetailPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <PhotoDetail />
      </main>
    </div>
  );
}