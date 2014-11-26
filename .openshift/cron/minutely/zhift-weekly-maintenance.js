#!/usr/bin/env node

var request = require('request');

var CRON_USERNAME = 'cron';
var CRON_PASSWORD = '99570761084371110795';

// Log in as cron.

request.post(
    'http://zhift-seropian.rhcloud.com/login',
    {
        username: CRON_USERNAME,
        password: CRON_PASSWORD,
    },
    function(err, res, body) {
        console.log('ERROR', err);
        console.log('BODY', body);
    }
);


// Create shifts for three weeks from now

// Delete old shifts, records

// var fs = require('fs');

// request.get(
//     'http://zhift-seropian.rhcloud.com/org/CC',
//     function (error, response, body) {
//         console.log('ERROR', error); // null if success
//         console.log('RESPONSE', response);
//         console.log('BODY', body); // org is success
//     }
// );

// var logPath = process.env.OPENSHIFT_LOG_DIR + '/zhift-cron-debug.log';
// var currentTime = new Date().toTimeString();
// fs.writeFileSync(logPath, request.toString());

