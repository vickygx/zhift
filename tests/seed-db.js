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

var fn = function(err) {
    if (err) {
        console.log(err);
    }
};

module.exports = function(db, fn) {
    new Organization({_id: 'CC'}).save(fn);
    new ManagerUser({
        name: 'Lily Seropian',
        email: 'seropian@mit.edu',
        password: 'lily',
        org: 'CC'
    }).save(function(err, user) {
        new User(user).save(fn);
    });
};