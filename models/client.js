var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var clientSchema = new mongoose.Schema({
  title: {type: String},
  name: {type: String},
  job_title: {type: String},
  organization: {type: String},
  email: {type: String, unique: true},
  category: {type: String},
  subcategory: [{
    type: String
  }],
  mobile: String,
  phone: String,
  fax: String,
  core: Boolean
});

clientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Client', clientSchema);
