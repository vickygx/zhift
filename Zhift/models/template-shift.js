var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TemplateShiftSchema = new mongoose.Schema({
  dayOfWeek: { type: String, required: true}, 	// "Monday"
  start: { type: String, required: true}, 		// "HH:MM"
  end: {type: String, required: true}, 			// "HH:MM"
  responsiblePerson: {type: ObjectId, ref: 'User', required: true},
  schedule: {type: ObjectId, ref: 'Schedule', required: true}
});

TemplateShiftSchema.path('dayOfWeek').validate(function (value) {
  return /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i.test(value);
}, 'Invalid day of week.');
TemplateShfitSchema.path('start').required(true, 'Missing start time.');
TemplateShfitSchema.path('end').required(true, 'Missing end time.');
TemplateShfitSchema.path('responsiblePerson').required(true, 'Missing responsible person reference.');
TemplateShfitSchema.path('schedule').required(true, 'Missing schedule reference.');

module.exports = mongoose.model('TemplateShift', TemplateShiftSchema);
