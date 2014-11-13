var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TemplateShiftSchema = new mongoose.Schema({
  dayOfWeek: { type: String, required: true}, // "Monday" | "Tuesday" ...
  start: { type: String, required: true}, // "HH:MM"
  end: {type: String, required: true}, // "HH:MM"
  responsiblePerson: {type: ObjectId, ref: 'User', required: true},
  schedule: {type: ObjectId, ref: 'Schedule', required: true}
});

module.exports = mongoose.model('TemplateShift', TemplateShiftSchema);

