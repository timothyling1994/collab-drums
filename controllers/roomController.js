var uniqid = require('uniqid');
const { body,validationResult } = require('express-validator');
var Room = require('../models/room');


exports.join_room = function (req,res,next) {

	Room.find({roomId:req.params.id});
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
					email:req.body.email,
					roomId:generatedId
					
				}).save(err=>{
					if(err){
						return next(err);
					}

					return res.json({
						email:req.body.email,
						roomId:generatedId
					});
				});
};
