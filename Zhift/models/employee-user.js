/*  Schema + Mongoose model for EmployeeUser

    @author: Anji Ren
*/

var mongoose = require('mongoose');
var extend = require('mongoose-schema-extend');
var UserSchema = require('./user').schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var EmployeeUserSchema = UserSchema.extend({
    schedule: {type: ObjectId, required: false} // TODO: will need to be true for the final
});

module.exports = mongoose.model('EmployeeUser', EmployeeUserSchema);