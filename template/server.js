const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();

const credentials = {
    key: String(fs.readFileSync(path.join(__dirname, 'selfsigned.key'))),
    cert: String(fs.readFileSync(path.join(__dirname, 'selfsigned.cert'))),
};

app.use('/', express.static(path.join(__dirname, 'public')));

const server = https.createServer(credentials, app);
server.listen(443);
