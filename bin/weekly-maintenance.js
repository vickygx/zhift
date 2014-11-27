#!/usr/bin/env node

var request = require('request');
var fs = require('fs');

var CRON_EMAIL = 'cron@zhift.com';
var CRON_PASSWORD = '99570761084371110795';
var CRON_ORG = 'Zhift';
var URL = 'http://zhift-seropian.rhcloud.com';
var LOG_FILE = process.env.OPENSHIFT_LOG_DIR;

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD === undefined) {
    URL = 'http://localhost:8080';
    LOG_FILE = '../logs/weekly-maintenance.log';
}

var logError = function(err) {
    if (err) {
        fs.appendFile(LOG_FILE, new Date() + ': ' + err + '.\n', function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

/**
 * Log in as cron.
 */

var loginBody = {
    email: CRON_EMAIL,
    password: CRON_PASSWORD,
    org: CRON_ORG,
};

request.post(URL + '/login', {form: loginBody}, function(err, res, body) {
    if (err) {
        return logError(err);
    }

    if (body === 'Moved Temporarily. Redirecting to /') {
        return logError('Failed to log in');
    }

    createNewShifts();
    deleteAllOldShifts();
    deleteAllOldRecords();
});


/**
 * Create shifts for three weeks from now.
 */
var createNewShiftBody = {
    week: 3,
}
function createNewShifts() {
    getAllTemplateShifts(function(templateShifts) {
        templateShifts.forEach(function(templateShift) {
            request.post(URL + '/shift/' + templateShift._id, {form: createNewShiftBody}, logError);
        });
    });
};

/**
 * Get all template shifts in the database.
 * @param  {Function} fn Callback that takes (err, templateShifts)
 */
function getAllTemplateShifts(fn) {
    request.get(URL + '/template/all', function (err, res, body) {
        body = JSON.parse(body);
        if(body.message) {
            return logError(body.message);
        }
        fn(body);
    });
};

/**
 * Delete all shifts that have already occurred.
 */
function deleteAllOldShifts() {
    request.del(URL + '/shift/old', logError);
};

/**
 * Delete all records pertaining to shifts that have already occurred.
 */
function deleteAllOldRecords() {
    request.del(URL + '/record/old', logError);
};