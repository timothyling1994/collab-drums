//import fireBaseApp from "./firebase.js";
const { fireBaseApp,fireBaseStorage }  = require('./firebase');

//import express from 'express';
//import createServer from './server';
const express = require('express');
const createServer = require('./server');
//const userRouter = require('./routes/user');


require("./mongoConfig");

const app = createServer();
const httpServer = require("http").createServer(app);
var io = require("socket.io")(httpServer,{
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});
const roomRouter = require('./routes/room')(io);

const storage = fireBaseStorage.getStorage(fireBaseApp);

//app.use('/user', userRouter);
app.use('/', roomRouter);

io.on("connection",(socket) => {
	
	socket.on('new-user', (room, name) => {
	    socket.join(room)
	    socket.to(room).emit('user-connected', name)
	  })

	socket.on('joining-room',(roomName,name) => {

		socket.join(roomName)
		console.log(name+" joining:"+roomName);

		/*
		async function getSockets () {
			const sockets = await io.in(roomName).fetchSockets();
			console.log(sockets.length);
		};

		getSockets();*/

		socket.to(roomName).emit('user-connected',name);
	});

	socket.on('send_audio',(data)=>{
		console.log(data);

		const metadata = {
			instrumentNum: data.instrumentNum,
			contentType: 'audio/mp3',
		}
		const storageRef = fireBaseStorage.ref(storage,data.roomName+"/"+data.instrumentNum);
		/*fireBaseStorage.uploadBytes(storageRef,data.file).then((snapshot)=>{
			console.log('Uploaded a blob or file!');
		});*/

		const uploadTask = fireBaseStorage.uploadBytesResumable(storageRef,data.file, metadata);

		uploadTask.on('state_changed',
		  (snapshot) => {
		    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		    console.log('Upload is ' + progress + '% done');
		    switch (snapshot.state) {
		      case 'paused':
		        console.log('Upload is paused');
		        break;
		      case 'running':
		        console.log('Upload is running');
		        break;
		    }
		  }, 
		  (error) => {
		    // A full list of error codes is available at
		    // https://firebase.google.com/docs/storage/web/handle-errors
		    switch (error.code) {
		      case 'storage/unauthorized':
		        // User doesn't have permission to access the object
		        break;
		      case 'storage/canceled':
		        // User canceled the upload
		        break;

		      // ...

		      case 'storage/unknown':
		        // Unknown error occurred, inspect error.serverResponse
		        break;
		    }
		  }, 
		  () => {
		    // Upload completed successfully, now we can get the download URL
		    fireBaseStorage.getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
		      console.log('File available at', downloadURL);
		      console.log(data.roomName);
		      socket.to(data.roomName).emit('audio_url',downloadURL,data.instrumentNum);
		    });
		  }
		);

	});

	socket.on('disconnect',() => {
		//socket.broadcast.emit('user-disconnected',)
	});
});	

httpServer.listen(3000,() => console.log('app listening on port 3000'));

