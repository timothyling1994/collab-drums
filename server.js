const express = require('express');
var bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const userRouter = require('./routes/user');
const groupRouter = require('./routes/group');

function createServer(){
	const app = express();
	app.use(express.static(__dirname + '/public'));
	app.use(session({secret:"cats",resave:false,saveUninitialized:true}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.urlencoded({extended: false}));
	app.use('/user', userRouter);
	app.use('/group', groupRouter);

	return app;
};

module.exports = createServer;