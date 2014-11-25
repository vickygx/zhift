#!/usr/bin/env node
var fs = require('fs');
var logPath = process.env.OPENSHIFT_LOG_DIR + '/ticktock-node.log';
var currentTime = new Date().toTimeString();
fs.writeFileSync(logPath, currentTime);
