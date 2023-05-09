CREATE USER myUsername WITH PASSWORD 'myPassword';

CREATE TABLE public.user_profiles
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    age INT,
    avatar BYTEA,
    gameswon INT,
    statusid INT,
);

CREATE TABLE public.game
(
    id SERIAL PRIMARY KEY,
    score1 INT,
    score2 INT
);

CREATE TABLE public.profile_games
(
    profile_id INT,
    game_id INT,
    PRIMARY KEY(profile_id, game_id),
    FOREIGN KEY (profile_id)
        REFERENCES public.user_profiles(id)
        ON DELETE CASCADE,
    FOREIGN KEY (game_id)
        REFERENCES public.game(id)
        ON DELETE CASCADE
);

CREATE TABLE public.Users
(
    id SERIAL PRIMARY KEY,
    loginName VARCHAR(255),
    wordpass VARCHAR(255),
    secret2fa VARCHAR(255),
    is2faenabled BOOLEAN,
    user42id INT,
    refreshtoken VARCHAR(255),
    profileId INT,
    blocked INT[],
    CONSTRAINT fk_profile
    FOREIGN KEY (profileId)
    REFERENCES user_profiles(id)
    ON DELETE SET NULL
);

CREATE TABLE public.friends (
    id SERIAL PRIMARY KEY,
    from_user_id INT,
    to_user_id INT,
    CONSTRAINT fk_from_user
    FOREIGN KEY (from_user_id)
    REFERENCES public.Users(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_to_user
    FOREIGN KEY (to_user_id)
    REFERENCES public.Users(id)
    ON DELETE CASCADE,

    request_date TIMESTAMP,
    accepted BOOLEAN,

    CONSTRAINT unique_friends
    UNIQUE (from_user_id, to_user_id)
);

CREATE TABLE public.game
(
    id SERIAL PRIMARY KEY,
    player1_id INT,
    player2_id INT,
    player1_score INT,
    player2_score INT
);

CREATE TABLE public.user_profiles_games
(
    user_profile_id INT,
    game_id INT,
    PRIMARY KEY(user_profile_id, game_id),
    FOREIGN KEY (user_profile_id)
        REFERENCES public.user_profiles(id)
        ON DELETE CASCADE,
    FOREIGN KEY (game_id)
        REFERENCES public.game(id)
        ON DELETE CASCADE
);

CREATE TYPE chatroommode AS ENUM ('public', 'protected', 'private');

CREATE TABLE public.message
(
    id SERIAL PRIMARY KEY,
    content TEXT,
    chatroom_id INT,
    profile_id INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_chatroom
    FOREIGN KEY (chatroom_id)
    REFERENCES chatroom(id)
    ON DELETE CASCADE,
    CONSTRAINT fk_profile
    FOREIGN KEY (profile_id)
    REFERENCES user_profiles(id)
    ON DELETE CASCADE
);

CREATE TABLE public.chatroom
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NULL,
    image BYTEA,
    admins INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    -- participants JSONB DEFAULT '[]'::jsonb,
    mode chatroommode NOT NULL DEFAULT 'private',
    password_hash VARCHAR(255) NULL,
    last_message_id INT NULL,
    last_profile_id INT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_last_message
        FOREIGN KEY (last_message_id)
        REFERENCES message(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_last_profile
        FOREIGN KEY (last_profile_id)
        REFERENCES user_profiles(id)
        ON DELETE SET NULL
);

CREATE TABLE public.chatroom_participants
(
    chatroom_id INT NOT NULL,
    profile_id INT NOT NULL,
    PRIMARY KEY(chatroom_id, profile_id),
    FOREIGN KEY (chatroom_id)
        REFERENCES public.chatroom(id)
        ON DELETE CASCADE,
    FOREIGN KEY (profile_id)
        REFERENCES public.user_profiles(id)
        ON DELETE CASCADE
);

CREATE TABLE public.chatroom_admins
(
    chatroom_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(chatroom_id, user_id),
    FOREIGN KEY (chatroom_id)
        REFERENCES public.chatroom(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES public.Users(id)
        ON DELETE CASCADE
);

CREATE TABLE public.chatroom_blocked_users
(
    chatroom_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(chatroom_id, user_id),
    FOREIGN KEY (chatroom_id)
        REFERENCES public.chatroom(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES public.Users(id)
        ON DELETE CASCADE
);

CREATE TABLE public.mute
(
    chatroom_id INT NOT NULL,
    user_id INT NOT NULL,
    time_muted TIMESTAMPTZ,
    PRIMARY KEY(chatroom_id, user_id),
    FOREIGN KEY (chatroom_id)
        REFERENCES public.chatroom(id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES public.Users(id)
        ON DELETE CASCADE
);

ALTER TABLE public.Users OWNER TO myUsername;
ALTER TABLE public.user_profiles OWNER TO myUsername;
ALTER TABLE public.friends OWNER TO myUsername;
ALTER TABLE public.game OWNER TO myUsername;
ALTER TABLE public.user_profiles_games OWNER TO myUsername;
ALTER TABLE public.chatroom OWNER TO myUsername;
ALTER TABLE public.message OWNER TO myUsername;
ALTER TABLE public.chatroom_participants OWNER TO myUsername;
ALTER TABLE public.chatroom_admins OWNER TO myUsername;
ALTER TABLE public.chatroom_blocked_users OWNER TO myUsername;
ALTER TABLE public.mute OWNER TO myUsername;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO myUsername;
