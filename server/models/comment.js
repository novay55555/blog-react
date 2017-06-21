let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = Schema({
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
mongoose.Promise = global.Promise;
module.exports = mongoose.model('Comment', commentSchema);
