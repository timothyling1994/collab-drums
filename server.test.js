const request = require('supertest');
const express = require('express');
const mongoose = require("mongoose");
const createServer = require('./server');

const userRoute = require('./routes/user');
const userController = require('./controllers/userController');

const app = createServer();


beforeEach((done)=>{
	mongoose.connect(

	)
});


/*app.get('/user',function(req,res){
	res.status(200).json({name:'john'});
});*/

test('GET /user',(done) => {
	request(app)
	.get('/user')
	.expect('Content-Type',/json/)
	.expect('Content-Length','15')
	.expect(200)
	.end(function(err,res){
		if(err) throw done(err);
		return done();
	});
});
