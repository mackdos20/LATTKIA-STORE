import { useTheme } from "@/components/layout/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import type { Schema } from "@/lib/db-types";

interface PhotoDetailProps {
  photo: Schema["photos"];
}

export function PhotoDetail({ photo }: PhotoDetailProps) {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
      </div>
      
      <Card className={`overflow-hidden ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
        <div className="relative aspect-video md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden">
          <img 
            src={photo.imageUrl} 
            alt={photo.title} 
            className="h-full w-full object-cover"
          />
        </div>
        
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">{photo.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(photo.dateAdded)}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{photo.category}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-muted-foreground">{photo.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}