const mongoose = require('mongoose');
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

const User = mongoose.model('User', userSchema);
module.exports = User;
