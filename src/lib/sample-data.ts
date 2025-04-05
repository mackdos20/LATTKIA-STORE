import { fine } from "@/lib/fine";
import type { Schema } from "@/lib/db-types";

const samplePhotos: Schema["photos"][] = [
  {
    title: "Mountain Landscape",
    description: "Beautiful mountain landscape at sunset with vibrant colors.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Landscape",
    dateAdded: new Date().toISOString()
  },
  {
    title: "Urban Architecture",
    description: "Modern urban architecture with geometric patterns and glass facades.",
    imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Architecture",
    dateAdded: new Date().toISOString()
  },
  {
    title: "Ocean Waves",
    description: "Powerful ocean waves crashing against the shore during sunset.",
    imageUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Nature",
    dateAdded: new Date().toISOString()
  },
  {
    title: "Wildlife Portrait",
    description: "Close-up portrait of a majestic lion in its natural habitat.",
    imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Wildlife",
    dateAdded: new Date().toISOString()
  },
  {
    title: "Street Photography",
    description: "Candid street photography capturing everyday life in a bustling city.",
    imageUrl: "https://images.unsplash.com/photo-1519575706483-221027bfbb31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Street",
    dateAdded: new Date().toISOString()
  },
  {
    title: "Abstract Patterns",
    description: "Abstract patterns and textures found in nature and architecture.",
    imageUrl: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Abstract",
    dateAdded: new Date().toISOString()
  }
];

export async function seedSampleData() {
  try {
    // Check if we already have photos
    const existingPhotos = await fine.table("photos").select();
    
    if (!existingPhotos || existingPhotos.length === 0) {
      console.log("Seeding sample photo data...");
      await fine.table("photos").insert(samplePhotos);
      console.log("Sample data seeded successfully!");
    } else {
      console.log("Database already contains photos, skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding sample data:", error);
  }
}