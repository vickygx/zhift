/*  Schema + Mongoose model for Shift

    @author: Dylan Joss
*/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var RecordSchema = new mongoose.Schema({
    schedule: {type: ObjectId, ref: 'Schedule', required: true},
    content: {type: String, required: true}
});

module.exports = mongoose.model('Record', RecordSchema);
