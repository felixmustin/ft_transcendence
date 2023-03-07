CREATE USER myUsername WITH PASSWORD 'myPassword';


CREATE TABLE public.Users
(
    id SERIAL,
    firstname text,
    lastname text,
    username text,
    wordpass text
    -- CONSTRAINT employees_pkey PRIMARY KEY (id)
);

ALTER TABLE public.Users OWNER TO myUsername;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myUsername;

INSERT INTO public.Users (firstname, lastname, username, wordpass) VALUES
 ('Felix', 'Mustin', 'joke', 'mdp'),
 ('Monsieur', 'Cool', 'bg', 'mdp2');