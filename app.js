//import fireBaseApp from "./firebase.js";
//const { fireBaseApp,fireBaseStorage }  = require('./firebase');

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
        //origin: "https://collab-drums.netlify.app/",
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


const roomRouter = require('./routes/room')(io);

//const storage = fireBaseStorage.getStorage(fireBaseApp);

//app.use('/user', userRouter);

app.use(express.static(__dirname));

app.use(function(req,res,next){
	//res.setHeader('Access-Control-Allow-Origin', 'https://collab-drums.netlify.app');
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept,Origin');
	next();
});

app.get('/',function(req,res){
	res.send('hello world');
});

app.use('/', roomRouter);

io.on("connection",(socket) => {
	
	console.log("new client connected?");
	socket.on('joining-room',async (roomName) => {

		/*const socketsInRoom = await io.in(roomName).fetchSockets();

		console.log("# of sockets:"+socketsInRoom.length);
		if(socketsInRoom.length > 0)
		{
			io.to(socketsInRoom[0].id).emit('get-room-settings',socket.id, roomName);
		}*/
		console.log(roomName);
		socket.join(roomName);
		console.log("joining:"+roomName);
		socket.to(roomName).emit('user-connected');
	});

	let send_room_settings = async (socketId, roomName) => {

		/*
		let newTrackData = {
			current_step: 1,
			bpm: 120,
			tracks:[createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack()],
		};

		function createTrack () {

		  let stepArray = new Array(32).fill(false);

		  return {

		    stepArray,
		    audioURL: "",
		    audio: null,
		  };

		};

		const listRef = fireBaseStorage.ref(storage, roomName);
		const finished = await fireBaseStorage.listAll(listRef)
			.then(async (res)=>{

				let results = await Promise.all(res.items.map(async (itemRef)=>{
					await fireBaseStorage.getDownloadURL(fireBaseStorage.ref(storage,itemRef))
					.then((url)=>{
						let index = itemRef.name.indexOf('-');
						let instrumentIndex = parseInt(itemRef.name.substring(index+1));
						newTrackData.tracks[instrumentIndex-1].audioURL = url;
						return url;
					})
					.catch((error)=>{
						console.log(error);
					});
				}));
			}).catch((error)=>{
				console.log(error);
		});

		io.to(socketId).emit('set-room-settings',newTrackData);
		*/
	}; 

	/*socket.on('sending-room-settings', async (trackData, socketId, roomName) => {
		//get downloadURLs of existing audio files from firestore

		let newTrackData = {...trackData};
		const listRef = fireBaseStorage.ref(storage, roomName);
		const finished = await fireBaseStorage.listAll(listRef)
			.then(async (res)=>{

				let results = await Promise.all(res.items.map(async (itemRef)=>{
					await fireBaseStorage.getDownloadURL(fireBaseStorage.ref(storage,itemRef))
					.then((url)=>{
						let index = itemRef.name.indexOf('-');
						let instrumentIndex = parseInt(itemRef.name.substring(index+1));
						newTrackData.tracks[instrumentIndex-1].audioURL = url;
						return url;
					})
					.catch((error)=>{
						console.log(error);
					});
				}));
			}).catch((error)=>{
				console.log(error);
		});
		io.to(socketId).emit('set-room-settings',newTrackData);
	});*/

	socket.on('send_audio',(data)=>{

		/*
		console.log("REACHED:"+data);

		const metadata = {
			instrumentNum: data.instrumentNum,
			contentType: data.contentType,
			filename:data.fileName
		}
		const storageRef = fireBaseStorage.ref(storage,data.roomId+"/"+data.instrumentNum);

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
		      console.log(data.instrumentNum);



		      io.to(data.roomName).emit('audio_url',data.fileName,downloadURL,data.instrumentNum);
		      //socket.emit('upload-complete', data.fileName, downloadURL,data.instrumentNum);
		    });
		  }
		);*/

	});

	socket.on('disconnect',() => {
		//socket.broadcast.emit('user-disconnected',)
	});
});	

httpServer.listen(process.env.PORT || 8080,() => console.log('app listening on port 8080'));

