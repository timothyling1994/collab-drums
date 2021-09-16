var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomSchema = new Schema({
	connections: {type:[{userId:String, socketId: String}],required:true},
	roomId: {type:String,required:true},
	isPublic: {type:Boolean, required:true},
});

RoomSchema.virtual('url').get(function(){
	return '/'+ this.roomId;
});


module.exports = mongoose.model('Room',RoomSchema);