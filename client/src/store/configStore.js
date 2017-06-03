if (process.env.NODE_ENV !== 'production') {
  module.exports = require('./configStore.dev.js');
} else {
  module.exports = require('./configStore.prod.js');
}
