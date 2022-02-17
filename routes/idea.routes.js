const router = require('express').Router();
const { tokenCheck } = require('../auth/googleOAuth.middleware');
const controllers = require('./../controllers/idea.controllers');

// GET /ideas
router.get('/', controllers.getPaginated);
router.get('/count', controllers.getCount);
router.get('/:ideaId', controllers.getIdeaDetails);
router.get('/:ideaId/like', tokenCheck, controllers.isLiked);
router.get('/user/:userId', controllers.userIdeas);

// POST /ideas
router.post('/', tokenCheck, controllers.postIdea);
router.post('/:ideaId/like', tokenCheck, controllers.like);

module.exports = router;
