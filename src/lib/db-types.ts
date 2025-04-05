export type Schema = {
  photos: {
    id?: number;
    title: string;
    description?: string | null;
    imageUrl: string;
    category?: string | null;
    dateAdded: string;
  }
}