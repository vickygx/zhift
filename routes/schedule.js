/**
 * All routes relating to schedules.
 * @author: Anji Ren, Lily Seropian, Vicky Gong
 */

var express = require('express');
var router = express.Router();

// Controllers
var ScheduleController = require('../controllers/schedule');
var UserController = require('../controllers/user');
var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/**
 * POST to create a new schedule.
 * Request body should contain:
 *     {String} orgName The name of the organization to create the schedule for.
 *     {String} role    The name of the role for the new schedule.
 * Response body contains:
 *     {Schedule} The created schedule.
 */
router.post('/', function(req, res) {
    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.body.orgName, function(err, isManager){
        if (!isManager) {
            // TODO: temporary json, replace with proper error
            return res.send({message: 'error: you are not a manager'});
        }

        // If the user is a manager, create the schedule
        ScheduleController.createSchedule(req.body.orgName, req.body.role, function(err, schedule) {
            if (err) {
                // TODO: temporary error
                return res.status(500).send(err.message);
            } 
            res.send(schedule);
        });
    });
});

/**
 * DELETE an existing schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Schedule} The deleted schedule.
 */
router.delete('/:id', function(req, res) {
    // Checking if permissions are correct
    UserController.isManagerOfOrganization(req.user.email, req.user.org, function(err, isManager) {
        if (!isManager) {
            // TODO: temporary json, replace with proper error
            return res.send({message: 'error: you are not a manager. cannot delete'});
        }

        // If the user is a manager, delete the schedule
        ScheduleController.deleteSchedule(req.param('id'), req.user.org, function(err, schedule) {
            if (err) {
                //TODO: temp error
                return res.send(err);
            } 
            res.send(schedule);
        });
    });
});

/**
 * GET a schedule by id.
 * No request body parameters required.
 * Response body contains:
 *     {Schedule} The retrieved schedule.
 */
router.get('/:id', function(req, res) {
    // Checking if permissions are correct
    UserController.isUserOfOrganization(req.user.email, req.user.org, function(err, isUser) {
        // If the user is in organization, get the schedule
        if (!isUser) {
            // TODO: temporary json, replace with proper error
            return res.send({message: 'error: you are not a user. cannot get schedule'});
        }
        ScheduleController.retrieveSchedule(req.param('id'), function(err, schedule) {
            if (err) {
                // TODO: fix error
                return res.send(err);
            } 
            res.send(schedule);
        });
    });
});

/**
 * GET all schedules associated with an organization.
 * No request body parameters required.
 * Response body contains:
 *     {Schedule[]} The retrieved schedules.
 */
router.get('/all/:orgName', function(req, res) {
    // Checking if permissions are correct
    UserController.isUserOfOrganization(req.user.email, req.param('orgName'), function(err, isUser) {
        // If the user is in organization, get the schedule
        if (!isUser) {
            // TODO: temporary json, replace with proper error
            return res.send({message: 'error: you are not a user. cannot get schedule'});
        }
        ScheduleController.retrieveSchedulesByOrg(req.param('orgName'), function(err, schedules) {
            if (err) {
                return res.send(err);
            } 
            res.send(schedules);
        });
    });
});

module.exports = router;