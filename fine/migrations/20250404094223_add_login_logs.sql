CREATE TABLE login_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  ipAddress TEXT NOT NULL,
  userAgent TEXT NOT NULL,
  success INTEGER NOT NULL,
  failureReason TEXT
);