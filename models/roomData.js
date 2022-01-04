var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoomDataSchema = new Schema({

	bpm: {type:Number},
	tracks:{type:[
		{
			stepArray:Array,
			audioURL:String
		}
	]},

});

RoomDataSchema.virtual('url').get(function(){
	return this._id;
});


module.exports = mongoose.model('RoomData',RoomDataSchema);