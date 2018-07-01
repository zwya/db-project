var express = require('express');
var router = express.Router();
var paginate = require('express-paginate');
var json2csv = require('json2csv').parse;
var fs = require('fs');
var jwt = require('jsonwebtoken');

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

router.get('/', function(req, res, next){
  query = {}
  for(var key in req.query) {
    if(key != "page" && key != "limit" && key != "token"){
      query[key] = req.query[key];
    }
  }
  Client.find(query).limit(req.query.limit).skip(req.skip).exec(function(err, results) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    Client.count({}, function(err, count) {
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

router.get('/csv', function(req, res ,next) {
  var clients = [];
  Client.find().or([{category: req.query.category, subcategory: [req.query.subcategory]}, {core: true}]).exec(function(err, clients){
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      const fields = ['title', 'name', 'job_title', 'organization', 'email', 'category', 'subcategory', 'mobile', 'phone', 'fax', 'core'];
      var csv;
      try{
        csv = json2csv(clients, { fields });
      }
      catch(err){
        console.log(err);
      }
      var path = Date.now() + '.csv';
      res.status(200).json({
        file: csv
      });
  });
  /*Client.find({category: req.query.category, subcategory: [req.query.subcategory]}, function(err, clientsres){
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    clients = clientsres;
    if(req.query.core){
      Client.find({core: true}, function(err, clientsres) {
        if(err){
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        clientsres.forEach(function(element) {
          console.log(element);
          if(clients.indexOf(element) == -1) {
            clients.push(element);
          }
        });
        const fields = ['title', 'name', 'job_title', 'organization', 'email', 'category', 'subcategory', 'mobile', 'phone', 'fax', 'core'];
        var csv;
        try{
          csv = json2csv(clients, { fields });
        }
        catch(err){
          console.log(err);
        }
        var path = Date.now() + '.csv';
        res.status(200).json({
          file: csv
        });
      });
    }
  });*/
});

router.get('/:id', function(req, res, next) {
  Client.findById(req.params.id, function(err, client) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
      res.status(201).json(client);
  });
});

router.post('/', function(req, res, next){
  var client = new Client({
    title: req.body.title,
    name: req.body.name,
    job_title: req.body.job_title,
    organization: req.body.organization,
    email: req.body.email,
    category: req.body.category,
    subcategory: req.body.subcategory,
    mobile: req.body.mobile,
    phone: req.body.phone,
    fax: req.body.fax,
    core: req.body.core
  });
  client.save(function(err, client){
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    res.status(201).json({
      message: 'Saved client',
      obj: client
    });
  });
});

router.patch('/:id', function(req, res, next) {
  Client.findById(req.params.id, function(err, client) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!client) {
      return res.status(500).json({
        title: 'No Client Found',
        error: {message: 'Client not found'}
      });
    }
    client.title = req.body.title;
    client.name = req.body.name;
    client.job_title = req.body.job_title;
    client.organization = req.body.organization;
    client.email = req.body.email;
    client.category = req.body.category;
    client.subcategory = req.body.subcategory;
    client.mobile = req.body.mobile;
    client.phone = req.body.phone;
    client.fax = req.body.fax;
    client.core = req.body.core;
    client.save(function(err, client) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Updated client',
        obj: client
      });
    });
  })
});

router.delete('/:id', function(req, res, next) {
  Client.findById(req.params.id, function(err, client) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!client) {
      return res.status(500).json({
        title: 'No Client Found',
        error: {message: 'Client not found'}
      });
    }
    client.remove(function(err, result) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Deleted client',
        obj: result
      });
    });
  })
});

module.exports = router;
