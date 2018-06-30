var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  admin: Boolean
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
