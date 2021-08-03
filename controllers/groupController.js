var uniqid = require('uniqid');
const { body,validationResult } = require('express-validator');
var Group = require('../models/group');

exports.create_group = async function (req,res,next) {
	
	let isUnique = false;

	let generatedId="";

	while(!isUnique)
	{
		generatedId = uniqid().toLowerCase();
		await new Promise((resolve,reject)=>{
			Group.find({groupId:generatedId}).exec(function(err,result){
				if(err){return next(err);}
				if(result.length === 0)
				{
					isUnique = true;
					resolve(true);
				}
			});
		});
	}

	const group = new Group({
					email:req.body.email,
					groupId:generatedId
					
				}).save(err=>{
					if(err){
						return next(err);
					}

					return res.json({
						email:req.body.email,
						groupId:generatedId
					});
				});
};
