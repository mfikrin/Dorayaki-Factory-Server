const express = require('express');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const app = express();

const accesstoken = 'hv0DyfMXoJd0fhB8pPtxOr6Czg1F3TtMBH8JZbFVadx5dMKCB5HRmuh9sH7yP2A3Zd4svx0qZFjY3RiO';
app.use(bodyParser.json());

const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accesstoken, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

module.exports = authJWT;