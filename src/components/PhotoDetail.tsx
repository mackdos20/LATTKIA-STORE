import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
        setLoading(true);
        const fetchedPhoto = await fine.table("photos").select().eq("id", parseInt(id));
        
        if (fetchedPhoto && fetchedPhoto.length > 0) {
          setPhoto(fetchedPhoto[0]);
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
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
        <Skeleton className="h-[60vh] w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
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
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{photo.title}</h1>
      </div>
      
      <div className="rounded-lg overflow-hidden">
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          className="w-full max-h-[70vh] object-contain bg-black/5 dark:bg-white/5"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
        {photo.category && (
          <span className="bg-secondary px-2 py-1 rounded-md">{photo.category}</span>
        )}
        <span>Added on {formatDate(photo.dateAdded)}</span>
      </div>
      
      {photo.description && (
        <p className="text-lg leading-relaxed">{photo.description}</p>
      )}
    </div>
  );
}