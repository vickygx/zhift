/*  Schema + Mongoose model for User

    @author: Anji Ren
*/

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var errorChecking = require('../errors/error-checking');

var UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, require: true},
    password: { type: String, required: true},
    org: { type: String, ref: 'Organization', required: true}
});

module.exports = mongoose.model('User', UserSchema);