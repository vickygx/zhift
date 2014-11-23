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
 * GET a specific record.
 * No request body parameters required.
 * Response body contains:
 *     {Record} The found record.
 */
router.get('/:id', function(req, res, next) {
    RecordController.getRecord(req.param('id'), function(err, record) {
        if (err) {
            return next(err);
        } 
        res.send(record);
    });
});

module.exports = router;