var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Admin = mongoose.model('Admin', new Schema({
    username: {
        type: String,
        unique: true
    },
    password: String
}));

module.exports = Admin;