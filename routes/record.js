/**
 * Record routes.
 *
 * @author: Lily Seropian, Dylan Joss
 */

var express = require('express');
var router = express.Router();

var RecordController = require('../controllers/record');
var UserController = require('../controllers/user');
var ScheduleController = require('../controllers/schedule');

var ObjectId = require('mongoose').Types.ObjectId; 

var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/**
 * GET all records for a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Record[]} The found records.
 */
router.get('/schedule/:id', function(req, res) {
    ScheduleController.retrieveSchedule(req.param('id'), function(err, schedule) {
        if (err) {
            return res.status(403).send(err);
        }
        if (!schedule) {
            return res.status(404).send('Schedule ' + req.param('id') + ' does not exist.');
        }
        UserController.isManagerOfOrganization(req.user.email, schedule.org, function(err, isManager) {
            if (err) {
                return res.status(401).send(err);
            }
            if (!isManager) {
                return res.status(403).send('Unauthorized, you are not a manager of the appropriate organization. Cannot get records.');
            }
            RecordController.getRecordsForSchedule(req.param('id'), function(err, records) {
                if (err) {
                    return res.status(403).send(err);
                }
                res.send(records);
            });
        });
    });
});

/**
 * DELETE all records about changes that have already occurred.
 * No request body parameters requires.
 * No response body contents on success.
 */
router.delete('/old', function(req, res) {
    RecordController.deleteOldRecords(function(err, numDeleted) {
        if (err) {
            return res.status(403).send(err.message);
        }
        res.send({deleted: numDeleted});
    });
});

module.exports = router;