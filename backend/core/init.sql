CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL
);

CREATE TABLE chats (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 10000000000),
    last_message_text TEXT DEFAULT '_Чат создан_',
    last_message_time TIMESTAMP DEFAULT now(),
    last_message_author BIGINT DEFAULT 0,
    permissions JSONB DEFAULT '{}'::JSONB
);