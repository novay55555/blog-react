let mongoose = require('mongoose');
const articleTypeSchema = mongoose.Schema({
  type: Array
}, {
  collection: 'article_types'
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model('ArticleTypes', articleTypeSchema);
