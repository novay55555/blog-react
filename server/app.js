const express = require('express');
const credenticals = require('./credenticals.js');
const nodemailer = require('nodemailer');
const staticRes = require('./lib/static');

const app = express();
const mongodb = require('./lib/mongodb.js')(app, credenticals);
const apiRouter = require('./api');

app.set('port', process.env.PORT || 3000);

app.use(require('body-parser')());
app.use(require('cookie-parser')(credenticals.cookieSecret));
app.use(require('express-session')({
  secret: 'lovely lilo',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(__dirname + '/vendor'));

app.use(apiRouter);

// 注册一个服务器
app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminal in cmd :)');
});