var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RolesSchema   = new Schema({
    role_name: String,
});

module.exports = mongoose.model('Roles', RolesSchema);