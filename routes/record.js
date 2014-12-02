/**
 * Record routes.
 * TODO: Error handling, permissions
 * @author: Lily Seropian
 */

var express = require('express');
var router = express.Router();

var RecordController = require('../controllers/record');

var errors = require('../errors/errors');
var errorChecking = require('../errors/error-checking');

/**
 * GET all records for a schedule.
 * No request body parameters required.
 * Response body contains:
 *     {Record[]} The found records.
 */
router.get('/schedule/:id', function(req, res, next) {
    RecordController.getRecordsForSchedule(req.param('id'), function(err, records) {
        if (err) {
            return next(err);
        } 
        res.send(records);
    });
});

/**
 * DELETE all records about changes that have already occurred.
 * No request body parameters requires.
 * No response body contents on success.
 */
router.delete('/old', function(req, res, next) {
    RecordController.deleteOldRecords(function(err, numDeleted) {
        if (err) {
            return next(err);
        }
        res.send({});
    });
});

module.exports = router;