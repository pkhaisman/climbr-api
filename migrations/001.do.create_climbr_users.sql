CREATE TABLE climbr_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  name TEXT,
  bio TEXT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);