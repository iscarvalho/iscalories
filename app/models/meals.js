var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var date = new Date();
var current_hour = date.getHours();

var MealsSchema   = new Schema({
    name: String,
    cals: Number,
    created: { type: Date, default: Date.now },
    userId: String
});

module.exports = mongoose.model('Meals', MealsSchema);