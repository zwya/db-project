var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var paginate = require('express-paginate');

var userRoutes = require('./routes/user');
var clientRoutes = require('./routes/client');
var categoryRoutes = require('./routes/category');
var UpdateRequestRoutes = require('./routes/updaterequest');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean-angular6')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

var app = express();

app.use(paginate.middleware(10, 50));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist/mean-angular6')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-angular6')));
app.use('/api/user', userRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/updatereq', UpdateRequestRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});

module.exports = app;
