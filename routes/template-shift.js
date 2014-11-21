/*  All routes relating to template shifts
    
    @author: Anji Ren, Lily Seropian
*/

var express = require('express');
var router = express.Router();

// Controllers
var TemplateShiftController = require('../controllers/template-shift');
var ShiftController = require('../controllers/shift');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create template shift */
router.post('/', function(req, res){
	TemplateShiftController.createShift(req.body.day, req.body.startTime, req.body.endTime, 
		req.body.employeeId, req.body.scheduleId, 
		function(err, templateShift) {
			if (err) {
				res.send(err);
			} else {
				res.send(templateShift);
			}
		}
	);
});

/* GET request to get all template shifts associated with a schedule */
router.get('/all/:scheduleId', function(req, res){
    TemplateShiftController.getAllShiftsBySchedule(req.param('scheduleId'),
        function(err, templateShift) {
            if (err) {
                res.send(err);
            } else {
                res.send(templateShift);
            }
        }
    )
});

/* GET request for a template shift */
router.get('/:id', function(req, res){
	TemplateShiftController.retrieveShift(req.param('id'),
		function(err, templateShift) {
			if (err) {
				res.send(err);
			} else {
				res.send(templateShift);
			}
		}
	)
});

/* DELETE request to delete existing template shift and all shifts generated
   from that template shift */
router.delete('/:id', function(req, res){
	TemplateShiftController.deleteShift(req.param('id'), function(err, templateShift) {
		if (err) {
			res.send(err);
		} 
        else {
            ShiftController.deleteShiftsGeneratedFromTemplateShift(
                req.param('id'), function(err) {
                    if (err) {
                        res.send(err);
                    } 
                    else {
                        res.send(templateShift);
                    }
                }
            );
		}
	});
});

/* PUT request to reassign person responsible for existing template shift */
router.put('/reassign/:id', function(req, res){
	TemplateShiftController.giveShiftTo(req.param('id'), req.body.employeeId,
		function(err, templateShift) {
			if (err) {
				res.send(err);
			} else {
				res.send(templateShift);
			}
		}
	)
});

module.exports = router;