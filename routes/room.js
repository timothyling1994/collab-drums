var express = require('express');
const path = require('path');
var router = express.Router();
let roomController = require('../controllers/roomController');

const multer = require("multer");
const fileStorageEngine = multer.diskStorage({
	 destination: function (req, file, cb) {
    	cb(null, path.join(__dirname, '../uploads/'));
	  },
	  filename: function (req, file, cb) {
	    cb(null, Date.now()+"-"+file.originalname);
	  } 
});

const upload = multer({storage:fileStorageEngine});


var returnRoomRouter = function(io){
	
	console.log(path.join(__dirname, '../uploads/'));
	
	router.post('/create-public-room', roomController.create_room(io, true));

	router.post('/create-private-room', roomController.create_room(io, false));

	router.post('/update-audio-settings',upload.single('audioFile'),roomController.update_audio_settings(io,upload));

	router.post('/update-room-settings', roomController.update_room_settings(io));

	router.post('/update-bpm-settings', roomController.update_bpm_settings(io));

	router.get('/display-public-rooms', roomController.display_public_rooms);

	router.get('/initialize-room/:roomId', roomController.initializeRoom);

	router.get('/room/:roomId', roomController.join_room(io));

	router.get('/', roomController.display_home);

	return router; 
}

module.exports = returnRoomRouter; 