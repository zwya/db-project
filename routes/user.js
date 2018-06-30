var express = require('express');
var router = express.Router();
var paginate = require('express-paginate');

var User = require('../models/user');

router.get('/', function(req, res, next){
  User.find({}).limit(req.query.limit).skip(req.skip).exec(function(err, results) {
    handleError(err);
    User.count({}, function(err, count) {
      handleError(err);
      const pageCount = Math.ceil(count / req.query.limit);
      res.status(201).json({
        has_more: paginate.hasNextPages(req)(pageCount),
        data: results
      });
    });
  });
});

router.post('/', function(req, res, next){
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    admin: req.body.admin
  });
  user.save(function(err, user){
    handleError(err);
    res.status(201).json({
      message: 'Saved user',
      obj: result
    });
  });
});

router.patch('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    handleError(err);
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
      handleError(err);
      res.status(200).json({
        message: 'Updated user',
        obj: user
      });
    });
  })
});

router.delete('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    handleError(err);
    if(!user) {
      return res.status(500).json({
        title: 'No User Found',
        error: {message: 'User not found'}
      });
    }
    user.remove(function(err, result) {
      handleError(err);
      res.status(200).json({
        message: 'Deleted user',
        obj: result
      });
    });
  })
});

function handleError(err){
  if(err){
    return res.status(500).json({
      title: 'An error occured',
      error: err
    });
  }
}

module.exports = router;
