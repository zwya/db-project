var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

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
  Category.find({type: req.query.type}, function(err, categories){
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    res.status(201).json({
      data: categories
    });
  });
});

router.post('/', function(req, res, next){
  var category = new Category({
    name: req.body.name,
    type: req.body.type
  });
  category.save(function(err, category){
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    res.status(201).json({
      message: 'Saved category',
      obj: category
    });
  });
});

module.exports = router;
