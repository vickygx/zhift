/**
 * Script to seed the test database.
 * @author Lily Seropian
 */

var EmployeeUser = require('../models/employee-user');
var ManagerUser = require('../models/manager-user');
var Organization = require('../models/organization');
var Record = require('../models/record');
var Schedule = require('../models/schedule');
var Shift = require('../models/shift');
var Swap = require('../models/swap');
var TemplateShift = require('../models/template-shift');
var User = require('../models/user');

var TemplateShiftController = require('../controllers/template-shift');
var ShiftController = require('../controllers/shift');

var bCrypt = require('bcrypt-nodejs');

var fn = function(err) {
    if (err) {
        console.log(err);
    }
};

module.exports = function(db, fn) {
    // CC Organization
    new Organization({_id: 'CC'}).save(fn);

    // Manager Lily
    new ManagerUser({
        name: 'Lily Seropian',
        email: 'lilyseropian@gmail.com',
        password: bCrypt.hashSync('lily', bCrypt.genSaltSync(10)),
        org: 'CC',
    }).save(function(err, user) {
        new User(user).save(fn);
    });

    // Crocheter Role
    new Schedule({
        org: 'CC',
        role: 'Crocheter',
    }).save(function(err, schedule) {
        // Crocheter Employee Jane
        new EmployeeUser({
            name: 'Jane Doe',
            email: 'jane@mit.edu',
            password: bCrypt.hashSync('jane', bCrypt.genSaltSync(10)),
            org: 'CC',
            schedule: schedule._id,
        }).save(function(err, user) {
            new User(user).save(fn);
            // Jane's Monday Template Shift
            TemplateShiftController.createShift('Monday', '02:00', '04:00', user._id, schedule._id, (function(err, templateShift) {
                [1, 2, 3].forEach(function(next) {
                    ShiftController.createShiftFromTemplateShift(templateShift._id, next, new Date(), function(err, shift) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            }));
        });

        // Crocheter Employee John
        new EmployeeUser({
            name: 'John Doe',
            email: 'lilyseropian@gmail.edu',
            password: bCrypt.hashSync('john', bCrypt.genSaltSync(10)),
            org: 'CC',
            schedule: schedule._id,
        }).save(function(err, user) {
            new User(user).save(fn);
        }); 
    });
};