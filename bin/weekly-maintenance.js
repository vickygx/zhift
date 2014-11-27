#!/usr/bin/env node

var request = require('request');

var CRON_EMAIL = 'cron@zhift.com';
var CRON_PASSWORD = '99570761084371110795';
var CRON_ORG = 'Zhift';
var URL = 'http://zhift-seropian.rhcloud.com';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD === undefined) {
    URL = 'http://localhost:8080';
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
    if (body === 'Moved Temporarily. Redirecting to /') {
        console.log('FAILED TO LOG IN');
    }
    else {
        createNewShifts();
        deleteAllOldShifts();
        deleteAllOldRecords();
    }
});


/**
 * Create shifts for three weeks from now.
 */
var createNewShiftBody = {
    week: 3,
}
function createNewShifts() {
    getAllTemplateShifts(function(err, templateShifts) {
        templateShifts.forEach(function(templateShift) {
            request.post(URL + '/shift/' + templateShift._id, {form: createNewShiftBody}, function(err, res, body) {
                if (err) {
                    console.log(err);
                }
            });
        });
    });
};

/**
 * Get all template shifts in the database.
 * @param  {Function} fn Callback that takes (err, templateShifts)
 */
function getAllTemplateShifts(fn) {
    request.get(URL + '/template/all', function (err, res, body) {
        fn(null, JSON.parse(body));
    });
};

/**
 * Delete all shifts that have already occurred.
 */
function deleteAllOldShifts() {
    request.del(URL + '/shift/old', function (err, res, body) {
        if (err) {
            console.log(err);
        }
    });
};

/**
 * Delete all records pertaining to shifts that have already occurred.
 */
function deleteAllOldRecords() {
    request.del(URL + '/record/old', function (err, res, body) {
        if (err) {
            console.log(err);
        }
    });
};