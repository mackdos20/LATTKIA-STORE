import type { Schema } from "@/lib/db-types";

export function getSamplePhotos(): Schema["photos"][] {
  return [
    {
      id: 1,
      title: "Mountain Sunrise",
      description: "A beautiful sunrise captured from the top of Mount Rainier. The golden light illuminates the landscape, creating a breathtaking view that stretches for miles.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      category: "Landscape",
      dateAdded: "2023-05-15"
    },
    {
      id: 2,
      title: "Urban Architecture",
      description: "Modern skyscrapers in downtown Chicago creating geometric patterns against the blue sky. The glass facades reflect the surrounding buildings and clouds.",
      imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      category: "Architecture",
      dateAdded: "2023-06-22"
    },
    {
      id: 3,
      title: "Ocean Waves",
      description: "Powerful ocean waves crashing against the rocky shore during sunset. The golden light creates a dramatic atmosphere as the water sprays into the air.",
      imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      category: "Seascape",
      dateAdded: "2023-07-08"
    },
    {
      id: 4,
      title: "Desert Dunes",
      description: "Endless sand dunes in the Sahara Desert at dusk. The low angle of the sun creates dramatic shadows and highlights the ripples in the sand.",
      imageUrl: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80",
      category: "Landscape",
      dateAdded: "2023-08-14"
    },
    {
      id: 5,
      title: "Forest Mist",
      description: "Morning mist floating through a dense pine forest. Sunbeams filter through the trees, creating a magical atmosphere in the woodland.",
      imageUrl: "https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
      category: "Nature",
      dateAdded: "2023-09-03"
    },
    {
      id: 6,
      title: "City Lights",
      description: "Vibrant city lights captured from a high vantage point at night. The streets form glowing arteries through the urban landscape.",
      imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80",
      category: "Urban",
      dateAdded: "2023-10-19"
    },
    {
      id: 7,
      title: "Autumn Colors",
      description: "A vibrant display of autumn foliage in a New England forest. The red, orange, and yellow leaves create a stunning natural tapestry.",
      imageUrl: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      category: "Nature",
      dateAdded: "2023-11-05"
    },
    {
      id: 8,
      title: "Starry Night",
      description: "The Milky Way stretching across the night sky above a mountain landscape. The stars shine brightly against the dark canvas of space.",
      imageUrl: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
      category: "Astrophotography",
      dateAdded: "2023-12-12"
    }
  ];
}