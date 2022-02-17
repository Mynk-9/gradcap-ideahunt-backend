const router = require('express').Router();
const { tokenCheck } = require('../auth/googleOAuth.middleware');
const controllers = require('./../controllers/user.controller');

// GET /user
router.get('/:userId', controllers.getUser);

// POST /user
router.post('/profile/linkedin', tokenCheck, controllers.postLinkedin);
router.post('/profile/instagram', tokenCheck, controllers.postInstagram);
router.post('/profile/twitter', tokenCheck, controllers.postTwitter);
router.post('/profile/college', tokenCheck, controllers.postCollege);
router.post('/profile/gradYear', tokenCheck, controllers.postGradYear);

module.exports = router;
