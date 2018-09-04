var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var paginate = require('express-paginate');

var UpdateRequest = require('../models/updaterequest');
var Client = require('../models/client');

router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'secret', function(err, decoded) {
    if(err) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    next();
  });
});

router.post('/', function(req, res, next){
  var today = new Date();
  today = today.toLocaleDateString("en-US", {year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute: 'numeric', second: 'numeric'});
  req.body.fieldstoupdate.map(function(element, index) {
    var requestUpdate = new UpdateRequest({
      client: req.body.clientid,
      fieldtoupdate: element,
      newvalue: req.body.values[index]['newvalue'],
      oldvalue: req.body.values[index]['oldvalue'],
      requestedby: req.body.userid,
      requestdate: today,
      requeststatus: 'New'
    });
    requestUpdate.save(function(err, requestupdate){
      if(err){
        console.log(err);
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
    });
  });
  res.status(201).json({
    message: 'Saved request'
  });
});

router.get('/', function(req, res, next){
  query = {}
  for(var key in req.query) {
    if(key != "page" && key != "limit" && key != "token"){
      query[key] = req.query[key];
    }
  }
  UpdateRequest.find(query).limit(req.query.limit).skip(req.skip).populate('requestedby', 'username').populate('client', 'name organization subcategory').exec(function(err, results) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    UpdateRequest.count({}, function(err, count) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      const pageCount = Math.ceil(count / req.query.limit);
      res.status(201).json({
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results
      });
    });
  });
});

router.get('/:id', function(req, res, next) {
  UpdateRequest.findById(req.params.id, function(err, request) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
      res.status(201).json(request);
  });
});

router.get('/approve/:id', function(req, res, next) {
  UpdateRequest.findById(req.params.id, function(err, request) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
      request.requeststatus = 'approved';
      request.save();
      Client.findById(request.client, function(err, client) {
        if(err){
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        client[request.fieldtoupdate] = request['newvalue'];
        client.save();
        res.status(201).json({'status': 'request approved'});
      });
  });
});

router.get('/reject/:id', function(req, res, next) {
  UpdateRequest.findById(req.params.id, function(err, request) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
      request.requeststatus = 'rejected';
      request.save();
      res.status(201).json({'status': 'request rejected'});
  });
});

module.exports = router;
