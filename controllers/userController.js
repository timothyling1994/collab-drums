const { body,validationResult } = require('express-validator');
var User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.create_user = [
	body('email',"Must be an email address").isEmail().trim().escape().normalizeEmail(),
	body('password').isLength({min:5}).withMessage('Password must be at least 8 characters long.')
	.matches('[0-9]').withMessage('Password Must Contain a Number')
	.matches('[A-Z]').withMessage('Password Must Contain an Uppercase Letter')
	.trim().escape(),
	body('first_name',"Must specify a first name").trim().escape(),
	body('last_name',"Must specify a last name").trim().escape(),

	(req,res,next) => {
		const errors = validationResult(req);

		if(!errors.isEmpty()){
			res.status(422).json({
				errors: errors.array()
			});
			return;
		}

		else
		{
			bcrypt.hash(req.body.password,10,(err,hashedPassword)=>{
				if(err){return next(err)};

				const user = new User({
					email:req.body.email,
					first_name: req.body.first_name,
					last_name: req.body.last_name,
					password:hashedPassword
				}).save(err=>{
					if(err){
						return next(err);
					}

					console.log("user saved!");

					return res.json({
						email:req.body.email,
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						password:hashedPassword
					});
				});
			});
		}
	}



];