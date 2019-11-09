BEGIN;

TRUNCATE
    climbr_users_to_swipe,
    climbr_users_liked,
    climbr_users_matched,
    climbr_users
    RESTART IDENTITY CASCADE;

INSERT INTO climbr_users (name, bio, username, password)
VALUES
    ('Demo', '', 'demo@gmail.com', '$2a$12$QPp9kTOiz/ztC.INh1fnouuVZIHxEqIesW4vgL4BIdmefzOaWgZbO'),
    ('Amy Borch', '', 'amy@gmail.com', '$2y$12$WftiRwPcsHYQAUPMsqdfSe0btDpJPhGS82ufsFiIL8kHEuFPtUb9G'),
    ('Josh Dorr', '', 'josh@gmail.com', '$2y$12$m94xYmdjgqwgUchDzn2cfu7nBbtqzXHXRwz84ZNi/J6fR9BOf76w2'),
    ('Katrina Huack', '', 'katrina@gmail.com', '$2y$12$/GK7EqXLD2AFqHuxIYLo1uTvMITzenfYJFCEBFX3u6rI/G6J2QInK'),
    ('Rory Coughlin', '', 'rory@gmail.com', '$2y$12$DLxRbTHFkX00T/jBMarqTO9v/3BKOJrHoQI4s7R6MSu7iu3SMowkC'),
    ('Phil Khaisman', '', 'phil@gmail.com', '$2a$12$iY3JU2jnqHvP4UfHRLfWsOSxGgOvEbhDswzkSvEiqmyE41Lnh8HTi');

-- INSERT INTO climbr_users_to_swipe (user_id, user_to_swipe_id)
-- VALUES
--     (1, 2),
--     (1, 3),
--     (1, 4),
--     (1, 5),
--     (1, 6),
--     (2, 1),
--     (2, 3),
--     (2, 4),
--     (2, 5),
--     (2, 6),
--     (3, 1),
--     (3, 2),
--     (3, 4),
--     (3, 5),
--     (3, 6),
--     (4, 1),
--     (4, 2),
--     (4, 3),
--     (4, 5),
--     (4, 6),
--     (5, 1),
--     (5, 2),
--     (5, 3),
--     (5, 4),
--     (5, 6),
--     (6, 1),
--     (6, 2),
--     (6, 3),
--     (6, 4),
--     (6, 5);

INSERT INTO climbr_users_liked (user_id, user_liked_id)
VALUES
    (2, 1),
    (3, 1),
    (4, 1),
    (5, 1),
    (6, 1);

-- INSERT INTO climbr_users_matched (user_id, user_matched_id)
-- VALUES
--     (1, 3),
--     (3, 1),
--     (2, 3),
--     (3, 2),
--     (3, 6),
--     (6, 3),
--     (5, 6),
--     (6, 5);

COMMIT;
