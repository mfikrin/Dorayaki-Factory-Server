-- Temporary, STC
-- Factory DB - Postgresql

DROP DATABASE IF EXISTS factorydb;
CREATE DATABASE factorydb;

\c factorydb

DROP TABLE IF EXISTS bahan;
CREATE TABLE bahan(
    bahan_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    bahan_name VARCHAR(255) UNIQUE NOT NULL,
    bahan_qty INTEGER NOT NULL
);

DROP TABLE IF EXISTS dora;
CREATE TABLE dora(
    dora_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    dora_name VARCHAR(255) NOT NULL
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

DROP TABLE IF EXISTS request;
CREATE TABLE request(
    request_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    dora_id INTEGER NOT NULL,
    req_qty INTEGER NOT NULL,
    status VARCHAR(100) NOT NULL,
    CONSTRAINT fkreqdora FOREIGN KEY(dora_id) REFERENCES dora(dora_id)
);

DROP TABLE IF EXISTS request_log;
CREATE TABLE request_log(
    log_id SERIAL NOT NULL UNIQUE PRIMARY KEY,
    request_id INTEGER NOT NULL,
    ip VARCHAR(100) NOT NULL,
    timestamp_req TIMESTAMP NOT NULL, 
    epoint VARCHAR(100) NOT NULL,
    CONSTRAINT fklog FOREIGN KEY(request_id) REFERENCES request(request_id)
);

INSERT INTO users (username,email,password) VALUES ('admin','shokomakinohara10@gmail.com','ayaya');

INSERT INTO bahan (bahan_name, bahan_qty) VALUES ('Tepung',100);

INSERT INTO dora (dora_name) VALUES ('Jeruk');
INSERT INTO dora (dora_name) VALUES ('Stroberi');

INSERT INTO resep (bahan_id, dora_id, resep_qty) VALUES (1,1,30);

-- INSERT INTO request (dora_id, req_qty, status) VALUES (1,5,'pending');
-- INSERT INTO request (dora_id, req_qty, status) VALUES (1,10,'pending');

-- INSERT INTO request_log (request_id, ip, timestamp_req,epoint) VALUES (1,'123.123.123','2021-11-22 06:45:10','request');


-- will add request + log later on