var mongoose = require('mongoose');

var updateRequestSchema = new mongoose.Schema({
  client: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
  fieldtoupdate: {type: String},
  newvalue: {type: String},
  requestedby: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  requestdate: {type: String},
  requeststatus: {type: String},
  oldvalue: {type: String}
});

module.exports = mongoose.model('UpdateRequest', updateRequestSchema);
