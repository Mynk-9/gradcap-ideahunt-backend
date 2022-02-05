const mongoose = require('mongoose');
require('mongoose-type-url');

const userSchema = new mongoose.Schema(
   {
      // primary details
      email: { type: String, required: true, unique: true },
      name: { type: String, required: true },

      // personal info
      profileURL: mongoose.SchemaTypes.Url,
      college: String,
      gradDate: Date,

      // socials
      linkedin: String,
      instagram: String,
      gmail: String,
      twitter: String,

      // ideas
      ideas: [{ type: mongoose.Types.ObjectId, ref: 'Ideas' }],
   },
   { timestamps: true }
);

module.exports = mongoose.model('Users', userSchema);
