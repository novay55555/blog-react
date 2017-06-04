const express = require('express');
const credenticals = require('./credenticals.js');

const app = express();
const connectMongo = require('./lib/mongodb.js');
const apiRouter = require('./api');

connectMongo(app);

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

app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminal in cmd :)');
});