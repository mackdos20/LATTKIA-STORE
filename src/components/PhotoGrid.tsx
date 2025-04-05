import { useState, useEffect } from "react";
import { PhotoCard } from "@/components/PhotoCard";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";

// Sample photos for initial display
const samplePhotos: Schema["photos"][] = [
  {
    id: 1,
    title: "Mountain Landscape",
    description: "Beautiful mountain view at sunset",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Nature",
    dateAdded: new Date().toISOString()
  },
  {
    id: 2,
    title: "Urban Architecture",
    description: "Modern city buildings from below",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Urban",
    dateAdded: new Date().toISOString()
  },
  {
    id: 3,
    title: "Ocean Waves",
    description: "Powerful waves crashing on the shore",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seascape",
    dateAdded: new Date().toISOString()
  },
  {
    id: 4,
    title: "Forest Path",
    description: "Misty morning in the forest",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Nature",
    dateAdded: new Date().toISOString()
  },
  {
    id: 5,
    title: "Desert Sunset",
    description: "Golden hour in the desert",
    imageUrl: "https://images.unsplash.com/photo-1682686581580-d99b0230064e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Landscape",
    dateAdded: new Date().toISOString()
  },
  {
    id: 6,
    title: "Wildlife Portrait",
    description: "Close-up of a wild animal",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Wildlife",
    dateAdded: new Date().toISOString()
  }
];

export function PhotoGrid() {
  const [photos, setPhotos] = useState<Schema["photos"][]>(samplePhotos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // Try to fetch from database, but use sample photos if table doesn't exist yet
        const fetchedPhotos = await fine.table("photos").select();
        if (fetchedPhotos && fetchedPhotos.length > 0) {
          setPhotos(fetchedPhotos);
        }
      } catch (err) {
        console.error("Error fetching photos:", err);
        // Using sample photos instead of showing an error
        setPhotos(samplePhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}