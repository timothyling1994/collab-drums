var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomDataSchema = new Schema({

	bpm: {type:Number, required:true},
	tracks:{type:[{stepArray:Array,audioURL:String}]},

});

RoomDataSchema.virtual('url').get(function(){
	return '/'+ this.roomId;
});


module.exports = mongoose.model('RoomData',RoomDataSchema);