const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  _id: Number,
  name: String,
  password: String,
  email: String,
  role: Number,
  photoUrl: String
});
const CounterSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});
const userCounter = mongoose.model('UserCounters', CounterSchema);
userSchema.pre('save', function (next) {
  const doc = this;
  userCounter.findByIdAndUpdate({ _id: 'userId' }, { $inc: { seq: 1 } }, { upsert: true }, (err, counter) => {
    if (err) return next(err);
    counter ? doc._id = counter.seq + 1 : doc._id = 1;
    next();
  });
});
mongoose.Promise = global.Promise;
module.exports = mongoose.model('Users', userSchema);
