var express = require('express');
var router = express.Router();
var paginate = require('express-paginate');

var User = require('../models/user');

router.get('/', function(req, res, next){
  User.find({}).limit(req.query.limit).skip(req.skip).exec(function(err, results) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    User.count({}, function(err, count) {
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
  User.findById(req.params.id, function(err, user) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
      res.status(201).json(user);
  });
});

router.post('/', function(req, res, next){
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    admin: req.body.admin
  });
  user.save(function(err, user){
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    res.status(201).json({
      message: 'Saved user',
      obj: user
    });
  });
});

router.patch('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!user) {
      return res.status(500).json({
        title: 'No User Found',
        error: {message: 'User not found'}
      });
    }
    user.username = req.body.username;
    user.password = req.body.password;
    user.admin = req.body.admin;
    user.save(function(err, user) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Updated user',
        obj: user
      });
    });
  })
});

router.delete('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!user) {
      return res.status(500).json({
        title: 'No User Found',
        error: {message: 'User not found'}
      });
    }
    user.remove(function(err, result) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        message: 'Deleted user',
        obj: result
      });
    });
  })
});

module.exports = router;
