CREATE TABLE "User"
(
    id SERIAL,
    username text,
    password text
    -- CONSTRAINT employees_pkey PRIMARY KEY (id)
);

INSERT INTO User(username, password) VALUES
 ('Felix', 'Mustin'),
 ('Monsieur', 'Cool');