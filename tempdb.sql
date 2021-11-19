-- Temporary, STC
-- Factory DB - Postgresql

DROP DATABASE IF EXISTS factorydb;
CREATE DATABASE factorydb;

-- \c factorydb

DROP TABLE IF EXISTS bahan;
CREATE TABLE bahan(
    bahan_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    bahan_name VARCHAR(255) UNIQUE NOT NULL,
    bahan_qty INTEGER NOT NULL
);

DROP TABLE IF EXISTS dora;
CREATE TABLE dora(
    dora_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    dora_name VARCHAR(255) NOT NULL,
);

DROP TABLE IF EXISTS resep;
CREATE TABLE resep(
    bahan_id INTEGER NOT NULL,
    dora_id  INTEGER NOT NULL,
    resep_qty INTEGER NOT NULL,
    PRIMARY KEY(bahan_id,dora_id),
    CONSTRAINT fkbahan FOREIGN KEY(bahan_id) REFERENCES bahan(bahan_id),
    CONSTRAINT fkdora FOREIGN KEY(dora_id) REFERENCES dora(dora_id)
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    username VARCHAR(100) UNIQUE PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

INSERT INTO users (username,email,password) VALUES ('admin','shokomakinohara10@gmail.com','ayaya');

-- will add request + log later on