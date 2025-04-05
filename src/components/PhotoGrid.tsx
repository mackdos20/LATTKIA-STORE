import { useState, useEffect } from "react";
import { PhotoCard } from "@/components/PhotoCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Schema } from "@/lib/db-types";
import { getSamplePhotos } from "@/lib/sample-data";

export function PhotoGrid() {
  const [photos, setPhotos] = useState<Schema["photos"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // In a real app, we would fetch from the database
        // const fetchedPhotos = await fine.table("photos").select();
        
        // For now, we'll use sample data
        const samplePhotos = getSamplePhotos();
        setPhotos(samplePhotos);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Failed to load photos. Please try again later.");
      } finally {
        // Add a small delay to show loading state
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No photos found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}