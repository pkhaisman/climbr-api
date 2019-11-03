BEGIN;

TRUNCATE
  climbr_users
  RESTART IDENTITY CASCADE;

INSERT INTO climbr_users (name, username, password)
VALUES
  ('Mike Wadsley', 'mike@gmail.com', '$2a$12$QPp9kTOiz/ztC.INh1fnouuVZIHxEqIesW4vgL4BIdmefzOaWgZbO'),
  ('Phil Khaisman', 'phil@gmail.com', '$2a$12$iY3JU2jnqHvP4UfHRLfWsOSxGgOvEbhDswzkSvEiqmyE41Lnh8HTi');

COMMIT;
