var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	email: {type:String,required:true},
	groupId: {type:String,required:true},
});

GroupSchema.virtual('url').get(function(){
	return '/'+ this.groupId;
});


module.exports = mongoose.model('Group',GroupSchema);