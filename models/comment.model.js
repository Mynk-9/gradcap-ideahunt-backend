const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({}, { timestamps: true });

commentSchema.add({
   data: String,
   userName: String,
   userId: { type: mongoose.Types.ObjectId, ref: 'Users' },
   likes: { type: mongoose.Types.ObjectId, ref: 'Users' },
   childComments: [commentSchema],
});

module.exports = mongoose.model('Comments', commentSchema);
