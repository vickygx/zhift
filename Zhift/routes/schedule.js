/*  All routes relating to schedules
    
    @author: Anji Ren, Lily Seropian
*/

var express = require('express');
var router = express.Router();

// Controllers
var ScheduleController = require('../controllers/schedule');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create schedule */
router.post('/', function(req, res) {
    ScheduleController.createSchedule(req.body.org, req.body.role, function(err, schedule) {
        if (err) {
            res.status(500).send(err);
        } 
        else {
            res.send(schedule);
        }
    });
});

/* POST request to delete existing schedule */
router.put('/delete/:id', function(req, res){
    ScheduleController.deleteSchedule(req.param('id'), function(err, schedule) {
        if (err) {
            res.send(e);
        } 
        else {
            res.send(schedule);
        }
    });
});

/* GET request to get schedule */
router.get('/:id', function(req, res){
    ScheduleController.retrieveSchedule(req.param('id'), function(err, schedule) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(schedule);
        }
    });
});

/* GET request to get all schedules associated with an organization */
router.get('/all/:orgName', function(req, res){
    ScheduleController.getAllSchedulesByOrg(req.param('orgName'), function(err, schedules) {
        if (e) {
            res.send(e);
        } 
        else {
            res.send(schedules);
        }
    });
});

module.exports = router;