const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const GOOGLE_OAUTH_SECRET = process.env.GOOGLE_OAUTH_SECRET;

const oAuthPipeline = async (req, next) => {
   try {
      const { access_token, email, expires_at } = req.body;

      if (!access_token || !email) {
         let err = new Error('Missing access_token or email');
         err.status = 400;
         next(err);
         return;
      }

      const userFetch = await fetch(
         `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
      );
      const userData = await userFetch.json();

      if (!userData) {
         let err = new Error('Authentication failed, try again');
         next(err);
         return;
      }

      if (userData.email !== email) {
         let err = new Error('Invalid login attempt');
         err.status = 401;
         next(err);
         return;
      }

      return { ...userData, expires_at: expires_at };
   } catch (err) {
      next(err);
   }
};

module.exports = { tokenCheck, oAuthPipeline };
