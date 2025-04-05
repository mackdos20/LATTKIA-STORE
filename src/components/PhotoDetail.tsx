import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";

// Sample photos for fallback
const samplePhotos: Schema["photos"][] = [
  {
    id: 1,
    title: "Mountain Landscape",
    description: "Beautiful mountain view at sunset. This photograph captures the majestic peaks bathed in golden light as the sun sets behind them. The rich colors and dramatic shadows create a sense of depth and tranquility.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Nature",
    dateAdded: new Date().toISOString()
  },
  {
    id: 2,
    title: "Urban Architecture",
    description: "Modern city buildings from below. This perspective emphasizes the towering height and geometric patterns of contemporary urban architecture. The glass facades reflect the sky, creating an interesting interplay of light.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Urban",
    dateAdded: new Date().toISOString()
  },
  {
    id: 3,
    title: "Ocean Waves",
    description: "Powerful waves crashing on the shore. The dynamic movement of water captured in this moment shows the raw power and beauty of the ocean. The spray and foam create interesting textures against the deep blue water.",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Seascape",
    dateAdded: new Date().toISOString()
  },
  {
    id: 4,
    title: "Forest Path",
    description: "Misty morning in the forest. The fog filters through the trees, creating a mystical atmosphere. The path invites the viewer to journey into the unknown, evoking a sense of wonder and exploration.",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Nature",
    dateAdded: new Date().toISOString()
  },
  {
    id: 5,
    title: "Desert Sunset",
    description: "Golden hour in the desert. The warm light bathes the sand dunes in rich orange and gold tones. The minimalist landscape creates a powerful sense of space and tranquility in this remote environment.",
    imageUrl: "https://images.unsplash.com/photo-1682686581580-d99b0230064e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Landscape",
    dateAdded: new Date().toISOString()
  },
  {
    id: 6,
    title: "Wildlife Portrait",
    description: "Close-up of a wild animal. This intimate portrait reveals the character and intensity of the subject. The detailed textures and direct gaze create a powerful connection between the viewer and this magnificent creature.",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Wildlife",
    dateAdded: new Date().toISOString()
  }
];

export function PhotoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<Schema["photos"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!id) return;
      
      try {
        // Try to fetch from database first
        const photos = await fine.table("photos").select().eq("id", parseInt(id));
        if (photos && photos.length > 0) {
          setPhoto(photos[0]);
        } else {
          // Fall back to sample data if not found in database
          const samplePhoto = samplePhotos.find(p => p.id === parseInt(id));
          if (samplePhoto) {
            setPhoto(samplePhoto);
          } else {
            setError("Photo not found");
          }
        }
      } catch (err) {
        console.error("Error fetching photo:", err);
        // Fall back to sample data if database query fails
        const samplePhoto = samplePhotos.find(p => p.id === parseInt(id));
        if (samplePhoto) {
          setPhoto(samplePhoto);
        } else {
          setError("Photo not found");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPhoto();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive mb-4">{error || "Photo not found"}</p>
        <Button onClick={() => navigate("/")}>Back to Gallery</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6 pl-0" 
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Button>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{photo.title}</h1>
          {photo.category && (
            <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm mb-4">
              {photo.category}
            </span>
          )}
          
          <p className="text-muted-foreground mb-4">
            Added on {new Date(photo.dateAdded).toLocaleDateString()}
          </p>
          
          {photo.description && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{photo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}