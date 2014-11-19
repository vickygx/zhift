/*  Schema + Mongoose model for Schedule

    @author: Anji
*/

var mongoose = require('mongoose');

var ScheduleSchema = new mongoose.Schema({
	org: {type: String, ref: 'Organization', required: true},
	role: {type: String, required: true}
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
