var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();
var db = require('./config/connection');
var session = require('express-session');

app.use(cors({ origin: 'https://restaurantuser.herokuapp.com', credentials: true, exposedHeaders: ['set-cookie'] }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: 'curiyosity',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 600000, sameSite:'none', secure:true },
	})
);
db.connect((err) => {
	if (err) console.log('error' + err);
	else console.log('database connected');
});

app.use((req, res, next) => {
  console.log(req.cookies, "cookies")
	res.cookie('check', '123', {
    sameSite: "none",
		secure:true
	});
  next()
});
app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
  console.log(err)
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error' + err);
});

module.exports = app;
