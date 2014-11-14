/*  Schema + Mongoose model for Schedule

    @author: Anji
*/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var errorChecking = require('../errors/error-checking');

var ScheduleSchema = new mongoose.Schema({
  org: { type: String, ref: 'Organization', required: true},
  role: { type: String, required: true, unique: true}
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
