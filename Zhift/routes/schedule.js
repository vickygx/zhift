/*  All routes relating to schedules
    
    @author: Anji Ren
*/

var express = require('express');
var router = express.Router();

// Controllers
var ScheduleController = require('../controllers/schedule');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create schedule */
router.post('/', function(req, res){
	ScheduleController.createSchedule(req.body.orgName, req.body.role, 
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

/* POST request to delete existing schedule */
router.put('/delete/:id', function(req, res){
	ScheduleController.deleteSchedule(req.param('id'),
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

/* GET request to get schedule */
router.get('/:id', function(req, res){
	ScheduleController.retrieveSchedule(req.param('id'),
		function(e, o) {
			if (e) {
				res.send(e);
			} else {
				res.send(o);
			}
		}
	)
});

/* GET request to get all schedules associated with an organization */
router.get('/all/:orgName', function(req, res){
	ScheduleController.getAllSchedulesByOrg(req.param('orgName'),
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