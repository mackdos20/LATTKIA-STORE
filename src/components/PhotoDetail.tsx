import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";

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
        const photos = await fine.table("photos").select().eq("id", parseInt(id));
        if (photos && photos.length > 0) {
          setPhoto(photos[0]);
        } else {
          setError("Photo not found");
        }
      } catch (err) {
        console.error("Error fetching photo:", err);
        setError("Failed to load photo. Please try again later.");
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
            <div className="prose dark:prose-invert">
              <p>{photo.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}