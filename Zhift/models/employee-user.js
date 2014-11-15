/*  Schema + Mongoose model for EmployeeUser

    @author: Anji Ren
*/

var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');

var UserSchema = require('./user').schema;

//

var EmployeeUserSchema = UserSchema.extend({});

module.exports = mongoose.model('EmployeeUser', EmployeeUserSchema);