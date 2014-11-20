/*  All routes relating to schedules
    
    @author: Anji Ren, Lily Seropian, Vicky Gong
*/

var express = require('express');
var router = express.Router();

// Controllers
var ScheduleController = require('../controllers/schedule');
var UserController = require('../controllers/user');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/* POST request to create schedule */
router.post('/', function(req, res) {
    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.body.orgName, 
        function(err, isManager){

            // If the user is a manager, create the schedule
            if (isManager){
                ScheduleController.createSchedule(req.body.orgName, req.body.role, function(err, schedule) {
                    if (err) {
                        // TODO: temporary error
                        res.status(500).send(err);
                    } 
                    else {
                        res.send(schedule);
                    }
                });
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a manager'});
            }
        });
});

/* POST request to delete existing schedule */
router.put('/delete/:id', function(req, res) {

    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.user.org, 
        function(err, isManager){

            // If the user is a manager, delete the schedule
            if (isManager){

                ScheduleController.deleteSchedule(req.param('id'), req.user.org, function(err, schedule) {
                    if (err) {
                        //TODO: temp error
                        res.send(err);
                    } 
                    else {
                        res.send(schedule);
                    }
                });
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a manager. cannot delete'});
            }
        });
    
});

/* GET request to get schedule */
router.get('/:id', function(req, res) {
    
    // Checking if permissions are correct
    UserController.isUserOfOrganization(req.user.email, req.user.org, 
        function(err, isUser){
            
            // If the user is in organization, get the schedule
            if (isUser){
                ScheduleController.retrieveSchedule(req.param('id'), function(err, schedule) {
                    if (err) {
                        // TODO: fix error
                        res.send(err);
                    } 
                    else {
                        res.send(schedule);
                    }
                });
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a user. cannot get schedule'});
            }
        });

   
});

/* GET request to get all schedules associated with an organization */
router.get('/all/:orgName', function(req, res) {

    // Checking if permissions are correct
    UserController.isUserOfOrganization(req.user.email, req.param('orgName'), 
        function(err, isUser){
            
            // If the user is in organization, get the schedule
            if (isUser){
                ScheduleController.retrieveSchedulesByOrg(req.param('orgName'), function(err, schedules) {
                    if (err) {
                        res.send(err);
                    } 
                    else {
                        res.send(schedules);
                    }
                });
            }
            // Else, send error message
            else {
                // TODO: temporary json, replace with proper error
                res.send({message: 'error: you are not a user. cannot get schedule'});
            }
        });

});

module.exports = router;