const trimCommentObject = comment => {
   const {
      _id: commentId,
      createdAt: postTime,
      data,
      user,
      likes,
      parentComment,
      childComments,
   } = comment;
   comment = {
      commentId,
      postTime,
      data,
      user,
      likes,
      parentComment,
      childComments,
   };
   if (!comment.likes) comment.likes = 0;
   else comment.likes = comment.likes.length;
   return comment;
};

module.exports = { trimCommentObject };
