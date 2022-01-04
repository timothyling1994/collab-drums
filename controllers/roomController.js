var uniqid = require('uniqid');
const { body,validationResult } = require('express-validator');
var Room = require('../models/room');
var RoomData = require('../models/roomData');


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

exports.initializeRoom = function(req,res,next){

		console.log(req.params.roomId);
		Room.find({roomId:req.params.roomId}).populate('RoomData').exec(function(err,roomData){
			if(err){return next(err);}

			console.log(roomData);
			res.json({
				room:roomData
			});

		});
	
};

exports.display_public_rooms = function(req,res,next){

	/*Room.find({'isPublic':true},'roomId').exec(function(err,list_rooms){
		if(err){return next(err);}
		res.json({
			rooms:list_rooms
		});
		//res.render('public_rooms_list',{rooms:list_rooms});
	});*/

	function createTrack () {

	  let stepArray = new Array(32).fill(false);

	  return {
	    stepArray,
	    audioURL: "placeholder",
	  };

	};

	const roomData = new RoomData({
			bpm: 120,
			tracks:[createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack()]
						
			}).save(function(err){
				if(err){
					return next(err);
				}
			});
	console.log("reached1");
	console.log(roomData.url);
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
	    audioURL: "placeholder",
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

		console.log("reached");
		const roomData = new RoomData({
			bpm: 120,
			tracks:[createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack()]
						
			}).save(err=>{
				if(err){
					return next(err);
				}
				console.log(roomData.url);
			});
		console.log("reached1");



		/*
		const roomData = new RoomData({
			bpm: 120,
			tracks: [createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack(),createTrack()],
		}).save(function(err){
			if(err){return next(err);}

			console.log(roomData.url);

			const room = new Room({
						connections:[{userId: req.body.userId, socketId:req.body.socketId}],
						roomId:generatedId,
						isPublic:isPublic,
						roomData: roomData.url,
						
					}).save(err=>{
						if(err){
							return next(err);
						} 

						console.log("TESTED1");

						Room.find({roomId:generatedId}).exec(function(err,result){
							if(err){return next(err);}
							//_io.emit('room-created',generatedId);
							return res.json({
								createdRoom: true
							});
						});
			
			});
		});*/

		//console.log(roomData);
		//console.log(roomData.url);
	}
};

/*
exports.create_room = async function (req,res,next) {
	
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

	const room = new Room({
					connections:[{userId: req.body.userId, socketId:req.body.socketId}],
					roomId:generatedId
					
				}).save(err=>{
					if(err){
						return next(err);
					} 

					return res.redirect("/"+generatedId);
				});



};*/
