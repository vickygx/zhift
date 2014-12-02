/**
 * Script to seed the test database.
 * @author Lily Seropian, Anji Ren
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

var TOTAL_TO_COMPLETE = 9;
var counter = {
    numDone: 0,
    err: [],
};

module.exports = function(fn) {
    counter.numDone = 0;
    var done = function(err) {
        if (err) {
            counter.err.push(err);
        }

        counter.numDone += 1;
        if (counter.numDone === TOTAL_TO_COMPLETE) {
            fn(counter.err.length === 0 ? null : counter.err);
        }
    }

    new Organization({_id: 'ZhiftTest'}).save(done);

    new ManagerUser({
        name: 'test',
        email: 'test@zhift.com',
        password: bCrypt.hashSync('uepxcqkmxr3w7grs4qew', bCrypt.genSaltSync(10)),
        org: 'ZhiftTest',
    }).save(function(err, user) {
        new User(user).save(done);
    });

    // Organization: 'CC'
    new Organization({_id: 'CC'}).save(done);

    // Manager: 'Lily'
    new ManagerUser({
        name: 'Lily Seropian',
        email: 'lilyseropian@gmail.com',
        password: bCrypt.hashSync('lily', bCrypt.genSaltSync(10)),
        org: 'CC',
    }).save(function(err, user) {
        new User(user).save(done);
    });

    // Role/Schedule: 'Crocheter'
    new Schedule({
        org: 'CC',
        role: 'Crocheter',
    }).save(function(err, schedule) {
        // Employee: 'Jane' with Role: 'Crocheter' 
        new EmployeeUser({
            name: 'Jane Doe',
            email: 'jane@mit.edu',
            password: bCrypt.hashSync('jane', bCrypt.genSaltSync(10)),
            org: 'CC',
            schedule: schedule._id,
        }).save(function(err, user) {
            new User(user).save(done);
            // Jane's Monday Template Shift
            TemplateShiftController.createShift('Monday', '02:00', '04:00', user._id, schedule._id, (function(err, templateShift) {
                [1, 2, 3].forEach(function(next) {
                    ShiftController.createShiftFromTemplateShift(templateShift._id, next, new Date(), function(err, shift) {
                        if (err) {
                            return done(err);
                        }
                        RecordController.recordShiftUpForGrabs('CC', [], 'Jane Doe', shift);
                        done();
                    });
                });
            }));
        });

        // Employee: 'John'
        new EmployeeUser({
            name: 'John Doe',
            email: 'lilyseropian@gmail.edu',
            password: bCrypt.hashSync('john', bCrypt.genSaltSync(10)),
            org: 'CC',
            schedule: schedule._id,
        }).save(function(err, user) {
            new User(user).save(done);
        });
    });
};