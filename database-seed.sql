CREATE TABLE "users"
(
    id SERIAL,
    firstname text,
    lastname text
    -- CONSTRAINT employees_pkey PRIMARY KEY (id)
);

INSERT INTO users(firstname, lastname) VALUES
 ('Felix', 'Mustin'),
 ('Monsieur', 'Cool');