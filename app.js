var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();
var db = require('./config/connection')
var session = require('express-session')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('trust proxy',1)
app.use(cors({origin:'https://curiyosity.netlify.app',credentials:true}))
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Headers', 'Content-Type,multipart/form-data,Authorization');
res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
db.connect((err)=>{
  if(err)
  console.log("error"+err);
  else
  console.log("database connected");
});

app.use(session({secret:"curiyosity",cookie:{maxAge:600000}}));

app.use('/admin', adminRouter);
app.use('/', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'+ err);
});

module.exports = app;
