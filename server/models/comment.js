var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var commentSchema = Schema({
  _article: { type: Number, ref: 'Articles' },
  replyUserId: { type: Number, ref: 'Users' },
  content: String,
  reply: [{
    from: { type: Number, ref: 'Users' },
    to: { type: Number, ref: 'Users' },
    content: String,
    date: Number
  }],
  date: Number
});

module.exports = mongoose.model('Comment', commentSchema);