var express = require('express');
var router = express.Router();
let roomController = require('../controllers/roomController');

var returnRoomRouter = function(io){
	
	router.post('/create-room', roomController.create_room);

	router.get('/:roomId', roomController.join_room(io));

	router.get('/', roomController.test);

	return router; 
}



module.exports = returnRoomRouter; 