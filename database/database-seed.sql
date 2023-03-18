CREATE USER myUsername WITH PASSWORD 'myPassword';

CREATE TABLE public.user_profiles
(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    age INT,
    avatar BYTEA
);

CREATE TABLE public.Users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    wordpass VARCHAR(255),
    user42id INT,
    profileId INT,
    CONSTRAINT fk_profile
    FOREIGN KEY (profileId)
    REFERENCES user_profiles(id)
    ON DELETE SET NULL
);

ALTER TABLE public.Users OWNER TO myUsername;
ALTER TABLE public.user_profiles OWNER TO myUsername;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myUsername;