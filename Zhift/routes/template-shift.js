/*  All routes relating to template shifts
    
    @author: Anji Ren
*/

var express = require('express');
var router = express.Router();

// Controllers
var TemplateShiftController = require('../controllers/template-shift');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create template shift */
router.post('/', function(req, res){
	TemplateShiftController.createShift(req.body.day, req.body.startTime, req.body.endTime, 
		req.body.employeeId, req.body.scheduleId, 
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

/* POST request to delete existing template shift */
router.put('/delete/:id', function(req, res){
	TemplateShiftController.deleteShift(req.param('id'),
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

/* PUT request to reassign person responsible for existing template shift */
router.put('/reassign/:id', function(req, res){
	TemplateShiftController.giveShiftTo(req.param('id'), req.body.employeeId,
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

/* GET request to get all template shifts associated with a schedule */
router.get('/all/:scheduleid', function(req, res){
	TemplateShiftController.getAllShiftsBySchedule(req.param('scheduleId'),
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

module.exports = router;