var uniqid = require('uniqid');
const fs = require('fs')

const { body,validationResult } = require('express-validator');
var Room = require('../models/room');
var RoomData = require('../models/roomData');

const { fireBaseApp,fireBaseStorage }  = require('../firebase');
const storage = fireBaseStorage.getStorage(fireBaseApp);


exports.join_room = function (io) {
	const _io = io;

	return function(req,res,next)
	{

		Room.find({roomId:req.params.roomId}).exec(function(err,result){
			if(err){return next(err);}
			if(result.length===0)
			{
				//return res.redirect('/home');
				res.json({
					isValid: false,
				});
			}
			else
			{
				//res.render('room',{roomId:req.params.roomId});
				res.json({
					roomId:req.params.roomId,
					isValid: true,
				});
			}
		});
	}
};

exports.update_audio_settings = function (io,upload) {
	const _io = io;

	return async function(req,res,next)
	{

		console.log(req.body);
		console.log(req.file);
		let fileFormat = req.body.fileName.split(".")[1];

		const metadata = {
			instrumentNum: req.body.instrumentNum,
			contentType: req.body.contentType,
			filename:req.body.fileName+"."+fileFormat
		};

		const storageRef = fireBaseStorage.ref(storage,req.body.roomId+"/"+req.body.instrumentNum);


		try {
		  const audioFile = fs.readFileSync(req.file.path);
		  
		  const uploadTask = fireBaseStorage.uploadBytesResumable(storageRef,audioFile, metadata);

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
		      console.log(req.body.instrumentNum);

		      fs.unlink(req.file.path,function(){
		      	console.log("deleting audio file from temp storage");
		      });

		      let roomId = req.body.roomId;

		      Room.find({roomId:roomId}).exec(function(err,result){
		      	if(err){return next(err);}

		      	let newObject = {};
		      	newObject['tracks.'+ parseInt(req.body.instrumentNum)+".audioURL"] = downloadURL;
		      	newObject['tracks.'+ parseInt(req.body.instrumentNum)+".audioName"] = metadata.filename;

		      	RoomData.findByIdAndUpdate(result[0].roomData,{$set: newObject},{useFindAndModify: false},function(err,updatedRoomData){
					if(err){return next(err);}

					res.json({
						updated:true,
						downloadURL:downloadURL,
						instrumentNum: req.body.instrumentNum,

					});
				});

		      });

		      //io.to(data.roomName).emit('audio_url',data.fileName,downloadURL,data.instrumentNum);
		      //socket.emit('upload-complete', data.fileName, downloadURL,data.instrumentNum);
		    });
		  }
		);
		

		} catch (err) {
		  console.error(err)
		}

	}
};

exports.update_bpm_settings = function (io) {
	const _io = io;

	return function(req,res,next)
	{

		Room.find({roomId:req.body.roomId}).exec(function(err,result){
			if(err){return next(err);}
			if(result.length===0)
			{
				res.json({
					isValid: false,
				});
			}
			else
			{

				RoomData.findByIdAndUpdate(result[0].roomData,{bpm:req.body.bpm},{},function(err,updatedRoomData){
					if(err){return next(err);}

					_io.emit('bpm-updated',req.body.bpm);

					res.json({
						updated:true
					});
				});
				//get objectId of RoomData object
			}
		});
	}
};

exports.update_room_settings = function (io) {
	const _io = io;

	return function(req,res,next)
	{
		Room.find({roomId:req.body.roomId}).exec(function(err,result){
			if(err){return next(err);}
			if(result.length===0)
			{
				res.json({
					isValid: false,
				});
			}
			else
			{
				let newObject = {};
				newObject['tracks.'+ parseInt(req.body.trackNum)+".stepArray"] = req.body.gridArr[req.body.trackNum];
				console.log(newObject);
				RoomData.findByIdAndUpdate(result[0].roomData,{$set:newObject},{useFindAndModify: false},function(err,updatedRoomData){
					if(err){return next(err);}

					res.json({
						updated:true
					});
				});
			}
		});
	}
};

exports.initializeRoom = function(req,res,next){

		console.log("init:"+req.params.roomId);
		Room.find({roomId:req.params.roomId}).populate('roomData').exec(function(err,roomData){
			if(err){return next(err);}

			res.json({
				roomData:roomData
			});

		});
	
};

exports.display_public_rooms = function(req,res,next){

	Room.find({'isPublic':true},'roomId').exec(function(err,list_rooms){
		if(err){return next(err);}
		res.json({
			rooms:list_rooms
		});
	});
}

exports.display_home = function(req,res,next){

	res.render('index');
}

exports.create_room = function (io, isPublic) {
	const _io = io;

	function createTrack () {

	  let stepArray = new Array(32).fill(false);

	  return {
	    stepArray,
	    audioURL: null,
	    audioName:null,
	  };

	};

	return async function(req,res,next)
	{
		let isUnique = false;

		let generatedId="";

		while(!isUnique)
		{
			generatedId = uniqid().toLowerCase();

			await new Promise((resolve,reject)=>{
				Room.find({roomId:generatedId}).exec(function(err,result){
					if(err){return next(err);}
					if(result.length === 0)
					{
						isUnique = true;
						resolve(true);
					}
				});
			});
		}


		const roomData = new RoomData({
				bpm: 120,
				tracks:[createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack()]			
			
		});

		const roomDataId = roomData.url; 
		
		
		roomData.save(function(err){
					if(err){
						return next(err);
					}
		});


		const room = new Room({
					connections:[{userId: req.body.userId, socketId:req.body.socketId}],
					roomId:generatedId,
					isPublic:isPublic,
					roomData: roomDataId,
					
				}).save(err=>{
					if(err){
						return next(err);
					} 

					Room.find({roomId:generatedId}).exec(function(err,result){
						if(err){return next(err);}
						//_io.emit('room-created',generatedId);
						return res.json({
							createdRoom: true,
							roomId:generatedId,
						});
					});
		
		});
	}
};

