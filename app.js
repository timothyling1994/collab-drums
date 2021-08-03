const express = require('express');
const createServer = require('./server');

require("./mongoConfig");

const app = createServer();
app.listen(3000,() => console.log('app listening on port 3000'));

