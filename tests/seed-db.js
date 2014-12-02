/**
 * Script to seed the test database.
 * @author Lily Seropian
 */

var EmployeeUser            = require('../models/employee-user');
var ManagerUser             = require('../models/manager-user');
var Organization            = require('../models/organization');
var Record                  = require('../models/record');
var Schedule                = require('../models/schedule');
var Shift                   = require('../models/shift');
var Swap                    = require('../models/swap');
var TemplateShift           = require('../models/template-shift');
var User                    = require('../models/user');

var TemplateShiftController = require('../controllers/template-shift');
var ShiftController         = require('../controllers/shift');
var RecordController        = require('../controllers/record');

var bCrypt                  = require('bcrypt-nodejs');

var fn = function(err) {
    if (err) {
        console.log(err);
    }
};

var TOTAL_TO_COMPLETE = 15;
var counter = {
    numDone: 0,
    err: [],
};
var body = {};

module.exports = function(fn) {
    counter.numDone = 0;
    body = {};
    var done = function(err, data) {
        if (err) {
            counter.err.push(err);
        }
        if (data) {
            if (body[data.constructor.modelName]) {
                body[data.constructor.modelName].push(data);
            }
            else {
                body[data.constructor.modelName] = [data];
            }
        }

        counter.numDone += 1;
        if (counter.numDone === TOTAL_TO_COMPLETE) {
            fn(counter.err.length === 0 ? null : counter.err, body);
        }
    }

    new Organization({_id: 'ZhiftTest'}).save(done);

    new ManagerUser({
        name: 'test',
        email: 'test@zhift.com',
        password: bCrypt.hashSync('uepxcqkmxr3w7grs4qew', bCrypt.genSaltSync(10)),
        org: 'ZhiftTest',
    }).save(function(err, user) {
        done(err, user);
        new User(user).save(done);
    });

    // Role/Schedule: 'Crocheter'
    new Schedule({
        org: 'ZhiftTest',
        role: 'Crocheter',
    }).save(function(err, schedule) {
        done(err, schedule);
        // Employee: 'Jane' with Role: 'Crocheter' 
        new EmployeeUser({
            name: 'Jane Doe',
            email: 'jane@mit.edu',
            password: bCrypt.hashSync('jane', bCrypt.genSaltSync(10)),
            org: 'ZhiftTest',
            schedule: schedule._id,
        }).save(function(err, user) {
            done(err, user);
            new User(user).save(done);
            // Jane's Monday Template Shift
            TemplateShiftController.createShift('Monday', '02:00', '04:00', user._id, schedule._id, (function(err, templateShift) {
                done(err, templateShift);

                [1, 2, 3].forEach(function(next) {
                    ShiftController.createShiftFromTemplateShift(templateShift._id, next, new Date(), function(err, shift) {
                        done(err, shift);
                        RecordController.recordShiftUpForGrabs('ZhiftTest', [], 'Jane Doe', shift, done);
                    });
                });
            }));
        });

        // Employee: 'John'
        new EmployeeUser({
            name: 'John Doe',
            email: 'lilyseropian@gmail.edu',
            password: bCrypt.hashSync('john', bCrypt.genSaltSync(10)),
            org: 'ZhiftTest',
            schedule: schedule._id,
        }).save(function(err, user) {
            done(null, user);
            new User(user).save(done);
        });
    });
};