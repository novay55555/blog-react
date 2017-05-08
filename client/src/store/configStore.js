if ("production" !== process.env.NODE_ENV) {
  module.exports = require('./configStore.dev.js');
} else {
  module.exports = require('./configStore.prod.js');
}