const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema(
   {
      // idea data
      heading: { type: String, required: true },
      details: String,
      user: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },

      // featured etc
      featured: { type: Boolean, default: false },

      // idea responses
      likes: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
      comments: [{ type: mongoose.Types.ObjectId, ref: 'Comments' }],
   },
   { timestamps: true }
);

module.exports = mongoose.model('Ideas', ideaSchema);
