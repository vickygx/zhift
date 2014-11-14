/*  Schema + Mongoose model for EmployeeUser

    @author: Anji Ren
*/

var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var EmployeeUserSchema = require('./user');

//

var EmployeeUserSchema = UserSchema.extend({});

module.exports = EmployeeUserSchema;