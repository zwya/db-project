var express = require('express');
var router = express.Router();
var paginate = require('express-paginate');
var json2csv = require('json2csv').parse;
var fs = require('fs');
var jwt = require('jsonwebtoken');

var Client = require('../models/client');
var Category = require('../models/category');

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
  if(query['subcategory'] && query['subcategory'].length == 1) {
    query['subcategory'] = query['subcategory'][0];
  }
  else if(typeof(query['subcategory']) == "string") {
    query['subcategory'] = JSON.parse(query['subcategory']);
  }
  Client.find(query).limit(req.query.limit).skip(req.skip).exec(function(err, results) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    Client.count(query, function(err, count) {
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

router.post('/csv', function(req, res ,next) {
  var query = {};
  if(req.body.title && req.body.title != '') {
    query.title = req.body.title;
  }
  if(req.body.name && req.body.name != '') {
    query.name = req.body.name;
  }
  if(req.body.job_title && req.body.job_title != '') {
    query.job_title = req.body.job_title;
  }
  if(req.body.organization && req.body.organization != '') {
    query.organization = req.body.organization;
  }
  if(req.body.email && req.body.email != '') {
    query.email = req.body.email;
  }
  if(req.body.category && req.body.category != '') {
    query.category = req.category;
  }
  if(req.body.subcategory) {
    var subcategories = [];
    for(var i=0;i<req.body.subcategory.length;i++) {
      if(req.body.subcategory[i] != ''){
        subcategories.push(req.body.subcategory[i]);
      }
    }
    if(subcategories.length > 0) {
      if(subcategories.length == 1) {
        query.subcategory = subcategories[0];
      }
      else {
        query.subcategory = subcategories;
      }
    }
  }
  if(req.body.mobile && req.body.mobile != '') {
    query.mobile = req.body.mobile;
  }
  if(req.body.phone && req.body.phone != '') {
    query.phone = req.body.phone;
  }
  if(req.body.fax && req.body.fax != '') {
    query.fax = req.body.fax;
  }
  query.core = req.body.core;
  Client.find().or([query, {core: true}]).exec(function(err, clients){
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

router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'secret', function(err, decoded) {
    if(err) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    if(!decoded.user.admin) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    next();
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
  if(req.body.category != '') {
    Category.find({name: req.body.category, type: 'main'}, function(err, category){
      if(err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      if(category.length == 0) {
        var toBeSaved = new Category({name: req.body.category, type: 'main'});
        toBeSaved.save(function(err, category) {
          if(err){
            return res.status(500).json({
              title: 'An error occured',
              error: err
            });
          }
        });
      }
    });
  }
  if(req.body.subcategory[0] != '') {
    Category.find({name: req.body.subcategory[0], type: 'sub1'}, function(err, category){
      if(err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      if(category.length == 0) {
        var toBeSaved = new Category({name: req.body.subcategory[0], type: 'sub1'});
        toBeSaved.save(function(err, category) {
          if(err){
            return res.status(500).json({
              title: 'An error occured',
              error: err
            });
          }
        });
      }
    });
  }
  if(req.body.subcategory[1] != '') {
    Category.find({name: req.body.subcategory[1], type: 'sub2'}, function(err, category){
      if(err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      if(category.length == 0) {
        var toBeSaved = new Category({name: req.body.subcategory[1], type: 'sub2'});
        toBeSaved.save(function(err, category) {
          if(err){
            return res.status(500).json({
              title: 'An error occured',
              error: err
            });
          }
        });
      }
    });
  }
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
    console.log(req.body.core);
    client.core = req.body.core;
    if(req.body.category != '') {
      Category.find({name: req.body.category, type: 'main'}, function(err, category){
        if(err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        if(category.length == 0) {
          var toBeSaved = new Category({name: req.body.category, type: 'main'});
          toBeSaved.save(function(err, category) {
            if(err){
              return res.status(500).json({
                title: 'An error occured',
                error: err
              });
            }
          });
        }
      });
    }
    if(req.body.subcategory[0] != '') {
      Category.find({name: req.body.subcategory[0], type: 'sub1'}, function(err, category){
        if(err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        if(category.length == 0) {
          var toBeSaved = new Category({name: req.body.subcategory[0], type: 'sub1'});
          toBeSaved.save(function(err, category) {
            if(err){
              return res.status(500).json({
                title: 'An error occured',
                error: err
              });
            }
          });
        }
      });
    }
    if(req.body.subcategory[1] != '') {
      Category.find({name: req.body.subcategory[1], type: 'sub2'}, function(err, category){
        if(err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        if(category.length == 0) {
          var toBeSaved = new Category({name: req.body.subcategory[1], type: 'sub2'});
          toBeSaved.save(function(err, category) {
            if(err){
              return res.status(500).json({
                title: 'An error occured',
                error: err
              });
            }
          });
        }
      });
    }
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
