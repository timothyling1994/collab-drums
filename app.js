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
	socket.on('new-user', ([roomName,name]) => {
		console.log(roomName);
		//users[socket.id] = name;
		//socket.broadcast.emit('user-connected',name);
	})
});	

httpServer.listen(3000,() => console.log('app listening on port 3000'));

