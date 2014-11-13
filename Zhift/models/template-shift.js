var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TemplateShiftSchema = new mongoose.Schema({
  dayOfWeek: { type: String, required: true},
  start: { type: Number, required: true}, // should be type Date or number?
  end: {type: Number, required: true},
  responsiblePerson: {type: ObjectId, required: true},
  schedule: {type: ObjectId, required: true},
  dateScheduled: {type: Date, required: true},
  upForGrabs: {type: Boolean, required: true},
  upForSwap: {type: Boolean, required: true}

});

module.exports = mongoose.model('TemplateShift', TemplateShiftSchema);

