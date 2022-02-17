const router = require('express').Router();
const {
   login: googleLogin,
   verifyToken: googleVerifyToken,
} = require('../auth/googleOAuth.controller');
const {
   tokenCheck: googleTokenCheck,
} = require('../auth/googleOAuth.middleware');

router.post('/google', googleLogin);
router.post('/google/verify', googleTokenCheck, googleVerifyToken);

module.exports = router;
