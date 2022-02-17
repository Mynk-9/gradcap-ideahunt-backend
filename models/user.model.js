const mongoose = require('mongoose');
require('mongoose-type-url');

const userSchema = new mongoose.Schema(
   {
      // userId
      userId: { type: String, required: true, unique: true, index: true },

      // primary details
      email: { type: String, required: true, unique: true, index: true },
      name: { type: String, required: true },

      // personal info
      profileURL: mongoose.SchemaTypes.Url,
      college: String,
      gradYear: Date,

      // socials
      linkedin: String,
      instagram: String,
      twitter: String,

      // ideas
      ideas: [{ type: mongoose.Types.ObjectId, ref: 'Ideas' }],

      // rewards
      rewards: [{ type: String }],
   },
   { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
