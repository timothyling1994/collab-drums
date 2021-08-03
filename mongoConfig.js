const mongoose = require('mongoose');

require('dotenv').config();
const mongoDB = process.env.MONGODB_URL;
mongoose.connect(mongoDB,{ useUnifiedTopology:true, useNewUrlParser:true });
const db = mongoose.connection;
db.on('error',console.error.bind(console,"mongo connection error"));