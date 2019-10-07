const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commitSchema = new Schema(
  {
    url: String,
    description: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    anonymous: String,
    post: {type: Boolean, default: false},
    imgPath: String
  },
  {
    timestamps: true
  }
);

const Commit = mongoose.model('Commit', commitSchema);
module.exports = Commit;
