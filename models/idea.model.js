const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema(
   {
      // idea data
      heading: { type: String, required: true },
      brief: String,
      details: String,
      user: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },

      // idea responses
      likes: [{ type: mongoose.Types.ObjectId, ref: 'Users' }],
      comments: [{ type: mongoose.Types.ObjectId, ref: 'Comments' }],
   },
   { timestamps: true }
);

module.exports = mongoose.model('Ideas', ideaSchema);
