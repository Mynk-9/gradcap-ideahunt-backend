const User = require('../models/user.model');
const { userIdGen } = require('./../utilities/user.utilities');
const jwt = require('jsonwebtoken');

const { oAuthPipeline } = require('./googleOAuth.middleware');
const { trimUserObject } = require('../utilities/user.utilities');

const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET;

const login = async (req, res, next) => {
   try {
      // the oauth pipeline verifies the user and returns the email
      const userData = await oAuthPipeline(req, next);
      const { email, name, picture, expires_at } = userData;
      let userId = null;

      // search for the user in the database
      let user = await User.findOne({ email: email })
         .select('-ideas')
         .lean()
         .exec();

      // if not found, create new user;
      if (!user) {
         userId = await userIdGen(name);
         let newUser = new User({
            userId: userId,
            email: email,
            name: name,
            profileURL: picture,
         });
         user = await newUser.save();
      }

      // prepare user object to be sent
      const _id = user._id;
      user = trimUserObject(user);

      // now user exists, generate the token
      const payload = { email: email, expires_at: expires_at };
      const token = jwt.sign({ ...payload, _id: _id }, GOOGLE_OAUTH_SECRET);

      res.status(200).json({ ok: 1, ...payload, token, user: { ...user } });
   } catch (err) {
      console.log(err);
   }
};

const verifyToken = (req, res, next) => {
   // verification already done through middleware
   // now attach important data
   console.log(req.userData);
   User.findOne({ email: req.userData.email })
      .select('-ideas') // ignore ideas
      .lean()
      .exec()
      .then(resp => {
         resp = trimUserObject(resp);
         res.status(200).send(resp);
      })
      .catch(err => {
         console.log(err);
         res.status(500).send('Error in fetching user data');
      });
};

module.exports = { login, verifyToken };
