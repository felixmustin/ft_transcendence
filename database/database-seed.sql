CREATE USER myUsername WITH PASSWORD 'myPassword';

CREATE TABLE public.Users
(
    id SERIAL,
    email text,
    username text,
    firstname text,
    lastname text,
    wordpass text
    -- CONSTRAINT employees_pkey PRIMARY KEY (id)
);


ALTER TABLE public.Users OWNER TO myUsername;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myUsername;