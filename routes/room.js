var express = require('express');
var router = express.Router();
let roomController = require('../controllers/roomController');

var returnRoomRouter = function(io){
	
	router.post('/create-public-room', roomController.create_room(io, true));

	router.post('/create-private-room', roomController.create_room(io, false));

	router.get('/display-public-rooms', roomController.display_public_rooms);

	router.get('/initialize-room/:roomId', roomController.initializeRoom);

	router.get('/room/:roomId', roomController.join_room(io));

	router.get('/', roomController.display_home);

	return router; 
}



module.exports = returnRoomRouter; 