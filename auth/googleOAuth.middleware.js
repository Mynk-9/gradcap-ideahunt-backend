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

const tokenCheck = (req, res, next) => {
   try {
      const { authorization: token } = req.headers;

      if (!token) {
         res.status(403).send({ error: 'Unauthorized - missing token' });
         return;
      }

      const userData = jwt.verify(token, GOOGLE_OAUTH_SECRET, {
         algorithms: ['HS256'],
      });

      // error if token already expired
      if (userData.expires_at <= new Date().getTime()) {
         res.status(403).send({ error: 'Token expired' });
         return;
      }

      req.userData = userData;
      next();
   } catch (err) {
      res.status(403).send({
         error: 'Unexpected error in token verification.',
      });
   }
};

module.exports = { tokenCheck, oAuthPipeline };
