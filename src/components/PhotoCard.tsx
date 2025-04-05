import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import type { Schema } from "@/lib/db-types";

interface PhotoCardProps {
  photo: Schema["photos"];
}

export function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <Link to={`/photo/${photo.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-medium truncate">{photo.title}</h3>
              {photo.category && (
                <span className="text-white/80 text-sm">{photo.category}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}