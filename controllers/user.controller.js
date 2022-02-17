const { trimUserObject } = require('../utilities/user.utilities');
const User = require('./../models/user.model');

////////////////
/// HELPERS ////
////////////////

const getUserField = async (userId, field) => {
   const resp = await User.findOne({ userId: userId })
      .lean()
      .select(field)
      .exec();
   return resp[field];
};

////////////////
///// GET //////
////////////////

const getUser = (req, res, next) => {
   const userId = req.params.userId;
   User.findOne({ userId: userId })
      .select('-ideas')
      .lean()
      .exec()
      .then(user => {
         user = trimUserObject(user);
         res.status(200).send(user);
      })
      .catch(err => {
         console.log(err);
         const error = new Error('Error in processing request');
         next(error);
      });
};

const get = { getUser };

////////////////
///// POST /////
////////////////

const postLinkedin = (req, res) => {
   const _id = req.userData._id;
   const link = req.body.data;

   User.findOneAndUpdate(
      { _id },
      { linkedin: link },
      { upsert: true, new: true }
   )
      .lean()
      .select('-ideas')
      .exec()
      .then(user => {
         res.status(201).send({ link: user.linkedin });
      })
      .catch(error => {
         res.sendStatus(500);
         console.log(error);
      });
};

const postInstagram = (req, res) => {
   const _id = req.userData._id;
   const link = req.body.data;

   User.findOneAndUpdate(
      { _id },
      { instagram: link },
      { upsert: true, new: true }
   )
      .lean()
      .select('-ideas')
      .exec()
      .then(user => {
         res.status(201).send({ link: user.instagram });
      })
      .catch(error => {
         res.sendStatus(500);
         console.log(error);
      });
};

const postTwitter = (req, res) => {
   const _id = req.userData._id;
   const link = req.body.data;

   User.findOneAndUpdate(
      { _id },
      { twitter: link },
      { upsert: true, new: true }
   )
      .lean()
      .select('-ideas')
      .exec()
      .then(user => {
         res.status(201).send({ link: user.twitter });
      })
      .catch(error => {
         res.sendStatus(500);
         console.log(error);
      });
};

const postCollege = (req, res) => {
   const _id = req.userData._id;
   const college = req.body.data;

   User.findOneAndUpdate(
      { _id },
      { college: college },
      { upsert: true, new: true }
   )
      .lean()
      .select('-ideas')
      .exec()
      .then(user => {
         res.status(201).send({ college: user.college });
      })
      .catch(error => {
         res.sendStatus(500);
         console.log(error);
      });
};

const postGradYear = (req, res) => {
   const _id = req.userData._id;
   const date = req.body.data;

   User.findOneAndUpdate(
      { _id },
      { gradYear: date },
      { upsert: true, new: true }
   )
      .lean()
      .select('-ideas')
      .exec()
      .then(user => {
         res.status(201).send({ date: user.gradYear });
      })
      .catch(error => {
         res.sendStatus(500);
         console.log(error);
      });
};

const post = {
   postLinkedin,
   postInstagram,
   postTwitter,
   postCollege,
   postGradYear,
};

module.exports = { ...get, ...post };
