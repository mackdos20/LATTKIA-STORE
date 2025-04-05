import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/layout/theme-provider";
import type { Schema } from "@/lib/db-types";
import { motion } from "framer-motion";

interface PhotoCardProps {
  photo: Schema["photos"];
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const { theme } = useTheme();
  
  return (
    <Link to={`/photo/${photo.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`overflow-hidden ${
          theme === "dark" ? "hover:border-slate-700" : "hover:border-slate-300"
        } transition-all duration-300`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={photo.imageUrl} 
              alt={photo.title} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg truncate">{photo.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{photo.category}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}