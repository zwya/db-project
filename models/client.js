var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var clientSchema = new mongoose.Schema({
  title: {type: String, required: true},
  name: {type: String, required: true},
  job_title: {type: String, required: true},
  organization: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  category: {type: String, required: true}
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