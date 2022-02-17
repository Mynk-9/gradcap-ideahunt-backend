const mongoose = require('mongoose');
const Idea = require('../models/idea.model');
const User = require('../models/user.model');

////////////////
/// HELPERS ////
////////////////

const likedStatus = async (ideaId, userId) => {
   let idea = await Idea.findById(ideaId).lean().exec();
   if (idea.likes.find(val => val.equals(userId))) return true;
   return false;
};

const ideasMapper = ideas => {
   return ideas.map(
      ({ heading, details, likes, comments, user, _id, featured }) => ({
         ideaId: String(_id),
         featured: featured ? true : false,
         heading: heading,
         details: details,
         likes: likes.length,
         comments: comments.length,
         profile: {
            name: user.name,
            photo: user.profileURL,
            userId: user.userId,
         },
      })
   );
};

////////////////
///// GET //////
////////////////

/**
 * GET /ideas
 * All ideas paginated according to given page number and items per page.
 * Default 10 items per page. Default page is 1.
 */
const getPaginated = (req, res) => {
   const pageNumber = parseInt(req.query.page) || 1;
   const nPerPage = parseInt(req.query.perPage) || 10;

   Idea.find({})
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage)
      .lean()
      .populate('user')
      .exec()
      .then(ideas => {
         res.status(200).send({
            count: ideas.length,
            ideas: ideasMapper(ideas),
         });
      })
      .catch(error => {
         res.status(500).send({
            Error: String(error),
         });
      });
};

const getCount = (req, res, next) => {
   Idea.countDocuments({})
      .lean()
      .exec()
      .then(count => {
         console.log('ideas count', count);
         res.status(200).send({ count });
      })
      .catch(error => {
         console.log(error);
         next(new Error('Error in document counting'));
      });
};

const isLiked = (req, res) => {
   const ideaId = mongoose.Types.ObjectId(req.params.ideaId);
   const userId = mongoose.Types.ObjectId(req.userData._id);

   likedStatus(ideaId, userId)
      .then(liked => {
         res.status(200).send({ liked: liked });
      })
      .catch(error => {
         console.log(error);
         res.sendStatus(500);
      });
};

const userIdeas = async (req, res) => {
   const userId = req.params.userId;
   let _id = await User.findOne({ userId: userId }).lean().exec();

   Idea.find({ user: _id })
      .lean()
      .populate('user')
      .exec()
      .then(ideas => {
         ideas = ideasMapper(ideas);
         const count = ideas.length;
         res.status(200).send({ count, ideas });
      })
      .catch(error => {
         console.log(error);
         res.sendStatus(500);
      });
};

const getIdeaDetails = (req, res) => {
   const ideaId = req.params.ideaId;
   Idea.findOne({ _id: ideaId })
      .lean()
      .populate('user')
      .select('-comments')
      .exec()
      .then(({ heading, details, likes, comments, user, _id, featured }) => {
         const ideaDetails = {
            ideaId: String(_id),
            featured: featured ? true : false,
            heading: heading,
            details: details,
            likes: likes?.length ? likes.length : 0,
            comments: comments?.length ? comments.length : 0,
            profile: {
               name: user.name,
               photo: user.profileURL,
               userId: user.userId,
            },
         };
         res.status(200).send(ideaDetails);
      })
      .catch(err => {
         res.sendStatus(500);
         console.log(err);
      });
};

const gets = { getPaginated, getCount, isLiked, userIdeas, getIdeaDetails };

////////////////
///// post /////
////////////////

/**
 * POST /ideas
 * Add new idea. Needed userId, heading, brief, details.
 */
const postIdea = async (req, res) => {
   const { heading, brief, details } = req.body;
   const user_id = req.userData._id;

   const newIdea = new Idea({
      heading: heading,
      brief: brief,
      details: details,
      user: mongoose.Types.ObjectId(user_id),
   });
   newIdea
      .save()
      .then(({ _id }) => {
         User.findByIdAndUpdate(
            user_id,
            { $push: { ideas: _id } },
            { upsert: true, new: true }
         )
            .lean()
            .exec()
            .then(() => {
               res.status(201).send({ _id });
            })
            .catch(err => {
               res.status(500).send({ error: 'Error at updating user' });
               console.log(err);
            });
      })
      .catch(err => {
         res.status(500).send({ error: 'Error at saving idea.' });
         console.log(err);
      });
};

const like = async (req, res) => {
   const ideaId = mongoose.Types.ObjectId(req.params.ideaId);
   const userId = mongoose.Types.ObjectId(req.userData._id);
   const likeStatus = req.body.like;

   if (likeStatus === true)
      Idea.findByIdAndUpdate(
         ideaId,
         { $push: { likes: userId } },
         { upsert: true }
      )
         .lean()
         .exec()
         .then(() => res.status(201).send({ likeStatus }))
         .catch(error => {
            console.log(error);
            res.sendStatus(500);
         });
   else
      Idea.findByIdAndUpdate(
         ideaId,
         { $pull: { likes: userId } },
         { upsert: true }
      )
         .lean()
         .exec()
         .then(() => res.status(201).send({ likeStatus }))
         .catch(error => {
            console.log(error);
            res.sendStatus(500);
         });
};

const posts = { postIdea, like };

module.exports = { ...gets, ...posts };
