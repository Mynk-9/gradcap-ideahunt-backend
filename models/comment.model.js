const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
   {
      data: String,
      user: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
      likes: { type: mongoose.Types.ObjectId, ref: 'Users' },
      parentComment: { type: mongoose.Types.ObjectId, ref: 'Comments' },
      childComments: [{ type: mongoose.Types.ObjectId, ref: 'Comments' }],
   },
   { timestamps: true }
);

module.exports = mongoose.model('Comments', commentSchema);
