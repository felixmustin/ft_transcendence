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
    secret2fa VARCHAR(255),
    is2faenabled BOOLEAN,
    user42id INT,
    profileId INT,
    CONSTRAINT fk_profile
    FOREIGN KEY (profileId)
    REFERENCES user_profiles(id)
    ON DELETE SET NULL
);

CREATE TABLE public.conversations
(
    id SERIAL PRIMARY KEY,
    user1_id INT,
    user2_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_user1
    FOREIGN KEY (user1_id)
    REFERENCES Users(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_user2
    FOREIGN KEY (user2_id)
    REFERENCES Users(id)
    ON DELETE CASCADE
);

CREATE TABLE public.messages
(
    id SERIAL PRIMARY KEY,
    conversation_id INT,
    sender_id INT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_sender
    FOREIGN KEY (sender_id)
    REFERENCES Users(id)
    ON DELETE CASCADE
);

ALTER TABLE public.Users OWNER TO myUsername;
ALTER TABLE public.user_profiles OWNER TO myUsername;
ALTER TABLE public.conversations OWNER TO myUsername;
ALTER TABLE public.messages OWNER TO myUsername;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myUsername;