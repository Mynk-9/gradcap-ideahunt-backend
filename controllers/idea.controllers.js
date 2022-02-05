const mongoose = require('mongoose');
const Idea = require('../models/idea.model');

////////////////
///// GET //////
////////////////

/**
 * GET /ideas
 * All ideas paginated according to given page number and items per page.
 * Default 10 items per page. Default page is 1.
 */
const getAll = (req, res) => {
   const pageNumber = req.query.page || 1;
   const nPerPage = req.query.perPage || 10;

   Idea.find({})
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .exec()
      .then(ideas => {
         res.status(200).send({
            ideas: ideas.map(
               ({ heading, brief, details, likes, comments, user }) => ({
                  heading: heading,
                  brief: brief,
                  details: details,
                  likes: likes.length,
                  comments: comments.length,
                  user: user,
               })
            ),
         });
      })
      .catch(error => {
         res.status(500).send({
            Error: String(error),
         });
      });
};

const gets = { getAll };

////////////////
///// post /////
////////////////

/**
 * POST /ideas
 * Add new idea. Needed userId, heading, brief, details.
 */
const postOne = (req, res) => {
   const { heading, brief, details, userId } = req.body;

   let newIdea = new Idea({
      heading: heading,
      brief: brief,
      details: details,
      user: mongoose.Types.ObjectId(userId),
   });
   newIdea
      .save()
      .then(({ _id }) => {
         res.status(201).send({
            id: _id,
         });
      })
      .catch(error => {
         res.status(500).send({
            Error: error,
         });
      });
};

const posts = { postOne };

module.exports = { ...gets, ...posts };
