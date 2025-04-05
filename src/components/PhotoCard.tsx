import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { Schema } from "@/lib/db-types";

interface PhotoCardProps {
  photo: Schema["photos"];
}

export function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <Link to={`/photo/${photo.id}`}>
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
  );
}