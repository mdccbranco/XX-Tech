const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    role: {type: String, enum: ['user', 'adm'], default: 'user'},
    email: String,
    password: String,
    githubID: String
  },
  {
    timestamps: true
  }
);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
module.exports = User;
