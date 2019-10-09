const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkingSchema = new Schema(
  {
    title: String,
    url: String,
    description: String,
    category: String,
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    anonymous: String,
    post: {type: Boolean, default: false},
    imgPath: String,
    imgName: String,
    date: Date,
    address: String,
    location: { type: { type: String }, coordinates: [Number] }
  },
  {
    timestamps: true
  }
);

linkingSchema.index({ location: '2dsphere' });

const Linking = mongoose.model('Linking', linkingSchema);
module.exports = Linking;