import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PhotoDetail } from "@/components/PhotoDetail";
import { Skeleton } from "@/components/ui/skeleton";
import type { Schema } from "@/lib/db-types";
import { getSamplePhotos } from "@/lib/sample-data";

export default function PhotoPage() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Schema["photos"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        // In a real app, we would fetch from the database
        // const fetchedPhoto = await fine.table("photos").select().eq("id", Number(id));
        
        // For now, we'll use sample data
        const samplePhotos = getSamplePhotos();
        const foundPhoto = samplePhotos.find(p => p.id === Number(id));
        
        if (foundPhoto) {
          setPhoto(foundPhoto);
        } else {
          setError("Photo not found");
        }
      } catch (err) {
        console.error("Error fetching photo:", err);
        setError("Failed to load photo. Please try again later.");
      } finally {
        // Add a small delay to show loading state
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    
    fetchPhoto();
  }, [id]);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-destructive">{error}</p>
          </div>
        ) : photo ? (
          <PhotoDetail photo={photo} />
        ) : null}
      </div>
    </MainLayout>
  );
}