const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const credenticals = require('./credenticals.js');

const app = express();
const connectMongo = require('./lib/mongodb.js');
const apiRouter = require('./api');

connectMongo(app);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('cookie-parser')(credenticals.cookieSecret));
app.use(require('express-session')({
  secret: 'lovely lilo',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, '..', 'client')));

app.use(apiRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.listen(app.get('port'), () => {
  console.log(`
    Server started!
    Port:${app.get('port')}
    Env:${app.get('env')}
  `);
});
