//import fireBaseApp from "./firebase.js";
const fireBaseApp = require('./firebase');
//import express from 'express';
//import createServer from './server';
const express = require('express');
const createServer = require('./server');
//const userRouter = require('./routes/user');


require("./mongoConfig");

const app = createServer();
const httpServer = require("http").createServer(app);
var io = require("socket.io")(httpServer);
const roomRouter = require('./routes/room')(io);

//app.use('/user', userRouter);
app.use('/', roomRouter);

io.on("connection",(socket)=>{
	socket.on('new-user', (roomName,name) => {
		socket.join(roomName);

		console.log(roomName);
		console.log(name);

		console.log(socket.to(roomName));
		
		socket.to(roomName).emit('user-connected',name);
	});

	socket.on('disconnect',() => {
		//socket.broadcast.emit('user-disconnected',)
	});
});	

httpServer.listen(3000,() => console.log('app listening on port 3000'));

