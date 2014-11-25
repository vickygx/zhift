#!/usr/bin/env node

// Create shifts for three weeks from now

// Delete old shifts, records

var fs = require('fs');
var request = require('request');

// request.post(
//     'http://www.yoursite.com/formpage',
//     { form: { key: 'value' } },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body)
//         }
//     }
// );

var logPath = process.env.OPENSHIFT_LOG_DIR + '/ticktock-node.log';
// var currentTime = new Date().toTimeString();
fs.writeFileSync(logPath, request.toString());

