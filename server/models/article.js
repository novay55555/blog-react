var mongoose = require('mongoose'),
  Schama = mongoose.Schema;
var articleSchema = Schama({
  _id: Number,
  title: String,
  date: Number,
  author: String,
  description: String,
  articleType: String,
  content: String,
  comment: [{
    type: Schama.Types.ObjectId,
    ref: 'Comment'
  }]
});
var CounterSchema = Schama({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});
var ArticleCounters = mongoose.model('ArticleCounters', CounterSchema);
articleSchema.pre('save', function(next) {
  var doc = this;
  ArticleCounters.findByIdAndUpdate({ _id: 'articleId' }, { $inc: { seq: 1 } }, { upsert: true }, function(err, counter) { // upsert: true, 没有找到collection则自动创建, 这里的$inc因为是原子操作, 所以回调函数触发时, ta还没执行- -
    if (err) return next(err);
    counter ? doc._id = counter.seq + 1 : doc._id = 1;
    next();
  });
});
module.exports = mongoose.model('Articles', articleSchema);