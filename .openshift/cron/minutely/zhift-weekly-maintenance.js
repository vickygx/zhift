#!/usr/bin/env node

// Create shifts for three weeks from now

// Delete old shifts, records

var fs = require('fs');
var request = require('request');

request.get(
    'http://zhift-seropian.rhcloud.com/org/CC',
    function (error, response, body) {
        console.log('ERROR', error);
        console.log('RESPONSE', response);
        console.log('BODY', body);
    }
);

// var logPath = process.env.OPENSHIFT_LOG_DIR + '/zhift-cron-debug.log';
// var currentTime = new Date().toTimeString();
// fs.writeFileSync(logPath, request.toString());

