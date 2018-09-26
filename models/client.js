var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var clientSchema = new mongoose.Schema({
  title: {type: String},
  name: {type: String, index: true},
  job_title: {type: String},
  organization: {type: String},
  email: {type: String},
  category: {type: String},
  subcategory: [{
    type: String,
  }],
  mobile: {type: String},
  phone: {type: String},
  fax: {type: String},
  core: {type: Boolean, index: true},
  address: {type: String},
});

clientSchema.index({name: 'text'});
clientSchema.index({core: 1});
clientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Client', clientSchema);
