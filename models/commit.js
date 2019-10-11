const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commitSchema = new Schema(
  {
    title: String,
    url: String,
    // category: {type: String, enum:['yes', 'bits']},
    category: String,
    description: {type: String, text: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    anonymous: String,
    post: {type: Boolean, default: false},
    imgPath: String,
    imgName: String
  },
  {
    timestamps: true
  }
);

const Commit = mongoose.model('Commit', commitSchema);
module.exports = Commit;
