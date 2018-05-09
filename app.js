var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var session = require('express-session');
var logger = require('morgan');
var csrf = require('csurf')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var csrfProtection = csrf({ cookie: true });
// var csrfProtection = csrf();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: true }
// }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/form', csrfProtection, function(req, res) {
    // pass the csrfToken to the view
    var csrfToken = req.csrfToken();
    res.cookie('csrf_token', csrfToken);
    res.render('send', { csrfToken })
})

app.post('/process', csrfProtection, function(req, res) {
    res.send('data is being processed')
})

app.post('/process_ajax', csrfProtection, function(req, res) {
    res.json({
        errcode: 0,
        errmsg: 'success'
    })
})

app.get('/process_ajax', function(req, res) {
    res.json({
        errcode: 0,
        errmsg: 'success'
    })
})

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
    res.render('error');
});

module.exports = app;