const request = require('supertest');
const express = require('express');
const mongoose = require("mongoose");
const createServer = require('./server');

//require("./mongoConfig");

const app = createServer();


test('/user route works', (done) => {
	request(app)
	.get("/user")
	.expect("Content-Type", /json/)
    .expect({ name: "frodo" })
    .expect(200, done);
});
