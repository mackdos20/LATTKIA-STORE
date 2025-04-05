CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT NOT NULL,
  category TEXT,
  dateAdded TEXT NOT NULL
);