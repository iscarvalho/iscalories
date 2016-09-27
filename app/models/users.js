var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UsersSchema   = new Schema({
    name: String,
    password: String,
    role: String,
    maxCals: Number
});

module.exports = mongoose.model('Users', UsersSchema);