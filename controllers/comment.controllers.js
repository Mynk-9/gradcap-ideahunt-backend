const mongoose = require('mongoose');
const { trimCommentObject } = require('../utilities/comments.utilities');
const Comment = require('./../models/comment.model');
const Idea = require('./../models/idea.model');

////////////////
/// HELPERS ////
////////////////

const likedStatus = async (commentId, userId) => {
   let comment = await Comment.findById(commentId).lean().exec();
   if (!comment.likes) return false;
   if (comment.likes.find(val => val.equals(userId))) return true;
   return false;
};

////////////////
///// GET //////
////////////////

const getComments = (req, res) => {
   const ideaId = mongoose.Types.ObjectId(req.query.ideaId);

   Idea.findById(ideaId)
      .lean()
      .populate({
         path: 'comments',
         populate: {
            path: 'user',
            select: 'userId name profileURL',
         },
      })
      .select('comments')
      .exec()
      .then(data => {
         const comments = data.comments.map(comment => {
            comment = trimCommentObject(comment);
            delete comment.user._id;
            return comment;
         });
         res.status(200).send(comments);
      })
      .catch(error => {
         console.log(error);
         res.sendStatus(500);
      });
};

const getChildren = (req, res) => {
   const commentId = mongoose.Types.ObjectId(req.params.commentId);

   Comment.findById(commentId)
      .lean()
      .populate({
         path: 'childComments',
         populate: {
            path: 'user',
            select: 'userId name profileURL',
         },
      })
      .select('childComments')
      .exec()
      .then(({ childComments }) => {
         const comments = childComments.map(comment => {
            comment = trimCommentObject(comment);
            delete comment.user._id;
            return comment;
         });
         res.status(200).send(comments);
      })
      .catch(error => {
         console.log(error);
         res.sendStatus(500);
      });
};

const isLiked = (req, res) => {
   const commentId = mongoose.Types.ObjectId(req.params.commentId);
   const userId = mongoose.Types.ObjectId(req.userData._id);

   likedStatus(commentId, userId)
      .then(liked => {
         res.status(200).send({ liked: liked });
      })
      .catch(error => {
         console.log(error);
         res.sendStatus(500);
      });
};

const gets = { getComments, getChildren, isLiked };

////////////////
///// post /////
////////////////

const postComment = async (req, res) => {
   const ideaId = mongoose.Types.ObjectId(req.query.ideaId);
   const userId = req.userData._id;

   let { data, parentComment } = req.body;
   let parentCommentObj;
   if (parentComment) parentCommentObj = mongoose.Types.ObjectId(parentComment);

   let newCommentData = {
      data: data,
      user: userId,
   };
   if (parentComment) newCommentData.parentComment = parentCommentObj;

   let newComment = new Comment(newCommentData);
   try {
      await newComment.save();
   } catch (e) {
      res.sendStatus(500);
      console.log(e);
      return;
   }
   const commentId = newComment._id;

   if (parentComment) {
      Comment.findByIdAndUpdate(
         parentCommentObj,
         { $push: { childComments: commentId } },
         { upsert: true }
      )
         .lean()
         .exec()
         .then(() => {
            res.status(201).send({ commentId: commentId });
         })
         .catch(error => {
            console.log(error);
            res.sendStatus(500);
         });
   } else {
      Idea.findOneAndUpdate(
         { _id: ideaId },
         { $push: { comments: commentId } },
         { upsert: true, new: true }
      )
         .lean()
         .select('comments')
         .exec()
         .then(() => {
            res.status(201).send({ commentId: commentId });
         })
         .catch(error => {
            res.sendStatus(500);
            console.log(error);
         });
   }
};

const commentLike = (req, res) => {
   const commentId = mongoose.Types.ObjectId(req.params.commentId);
   const userId = mongoose.Types.ObjectId(req.userData._id);
   const likeStatus = req.body.like ? true : false;

   if (likeStatus === true)
      Comment.findByIdAndUpdate(
         commentId,
         { $addToSet: { likes: userId } },
         { upsert: true, new: true }
      )
         .lean()
         .exec()
         .then(({ likes }) => res.status(201).send({ likes: likes.length }))
         .catch(error => {
            console.log(error);
            res.sendStatus(500);
         });
   else
      Comment.findByIdAndUpdate(
         commentId,
         { $pull: { likes: userId } },
         { upsert: true, new: true }
      )
         .lean()
         .exec()
         .then(({ likes }) => res.status(201).send({ likes: likes.length }))
         .catch(error => {
            console.log(error);
            res.sendStatus(500);
         });
};

const posts = { postComment, commentLike };

module.exports = { ...gets, ...posts };
