var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  admin: Boolean
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
