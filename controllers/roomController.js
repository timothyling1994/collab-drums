var uniqid = require('uniqid');
const { body,validationResult } = require('express-validator');
var Room = require('../models/room');


/*exports.join_room = function (req,res,next) {

	Room.find({roomId:req.params.roomId}).exec(function(err,result){
		if(err){return next(err);}
		if(result.length===0)
		{
			//redirect to home page
			return res.json({
				error: "Room does not exist",
			});
		}
		else
		{

			//redirect to specific room
			return res.json({
				success: "Room joined!",
			});
		}
	});
};*/

exports.join_room = function (io) {

	console.log(io);
	return function(req,res,next)
	{
		Room.find({roomId:req.params.roomId}).exec(function(err,result){
			if(err){return next(err);}
			if(result.length===0)
			{
				//redirect to home page
				return res.json({
					error: "Room does not exist",
				});
			}
			else
			{
				io.emit('room-joined',true);
				//redirect to specific room
				return res.json({
					success: "Room joined!",
				});
			}
		});
	}
};

exports.test = function(req,res,next){

	res.send("success");
}

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

					//res.redirect(generatedId);
					return res.json({
						connections:[{userId: req.body.userId, socketId:req.body.socketId}],
						roomId:generatedId
					});
				});



};
