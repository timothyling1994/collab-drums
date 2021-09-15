var uniqid = require('uniqid');
const { body,validationResult } = require('express-validator');
var Room = require('../models/room');


exports.join_room = function (io) {

	return function(req,res,next)
	{
		Room.find({roomId:req.params.roomId}).exec(function(err,result){
			if(err){return next(err);}
			if(result.length===0)
			{
				return res.redirect('/');
			}
			else
			{
				res.render('room',{roomId:req.params.roomId});
			}
		});
	}
};

exports.test = function(req,res,next){

	Room.find({},'roomId').exec(function(err,list_rooms){
		if(err){return next(err);}
		res.render('index',{rooms:list_rooms});
	});
}

exports.create_room = function (io) {
	const _io = io;

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

		const room = new Room({
						connections:[{userId: req.body.userId, socketId:req.body.socketId}],
						roomId:generatedId
						
					}).save(err=>{
						if(err){
							return next(err);
						} 

						Room.find({},'roomId').exec(function(err,result){
							if(err){return next(err);}
							_io.emit('room-created',generatedId);
						});
			
						return res.redirect("/"+generatedId);
		});

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
