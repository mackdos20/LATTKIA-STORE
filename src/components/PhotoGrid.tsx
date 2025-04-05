import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PhotoGrid() {
  const [photos, setPhotos] = useState<Schema["photos"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos = await fine.table("photos").select();
        setPhotos(fetchedPhotos || []);
      } catch (err) {
        console.error("Error fetching photos:", err);
        setError("Failed to load photos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <Link to={`/photo/${photo.id}`} key={photo.id}>
          <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
            <div className="aspect-square overflow-hidden">
              <img 
                src={photo.imageUrl} 
                alt={photo.title} 
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg mb-1">{photo.title}</h3>
              {photo.category && (
                <p className="text-sm text-muted-foreground">{photo.category}</p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}