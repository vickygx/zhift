/*  Schema + Mongoose model for ManagerUser

    @author: Anji Ren
*/

var mongoose = require('mongoose');
var extend 	= require('mongoose-schema-extend');

var ManagerUserSchema = require('./user');

//

var ManagerUserSchema = UserSchema.extend({});

module.exports = ManagerUserSchema;