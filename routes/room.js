var express = require('express');
var router = express.Router();
let roomController = require('../controllers/roomController');

var returnRoomRouter = function(io){
	
	router.post('/create-public-room', roomController.create_room(io, true));

	router.post('/create-private-room', roomController.create_room(io, false));

	router.get('/join-public-room', roomController.display_public_rooms);

	router.get('/:roomId', roomController.join_room(io));

	router.get('/', roomController.display_home);

	return router; 
}



module.exports = returnRoomRouter; 