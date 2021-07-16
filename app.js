const express = require('express');
const mongoose = require('mongoose');
const createServer = require('./server');



require('dotenv').config();
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB,{ useUnifiedTopology:true, useNewUrlParser:true }).then(()=>{
	const app = createServer();
	app.listen(3000,() => console.log('app listening on port 3000'));
});
const db = mongoose.connection;
db.on('error',console.error.bind(console,"mongo connection error"));

