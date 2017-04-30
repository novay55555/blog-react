var express = require('express');
var credenticals = require('./credenticals.js');
var nodemailer = require('nodemailer');
var staticRes = require('./lib/static');

var app = express();
var mongodb = require('./lib/mongodb.js')(app, credenticals);    
app.set('port', process.env.PORT || 3000); 

app.use(require('body-parser')()); 
app.use(require('cookie-parser')(credenticals.cookieSecret));
app.use(require('express-session')({
    secret: 'lovely lilo',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname + '/vendor')); 

require('./api/api.js')(app, credenticals, nodemailer);
app.use(function (req, res, next) {
    res.status(404);
    res.render('404', {layout: null});
});
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500', {layout: null});
});

// 注册一个服务器
app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminal in cmd :)');
});