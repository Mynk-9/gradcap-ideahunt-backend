const router = require('express').Router();
const { tokenCheck } = require('../auth/googleOAuth.middleware');
const controllers = require('./../controllers/comment.controllers');

// GET /ideas/comments
router.get('/', controllers.getComments);
router.get('/:commentId/children', controllers.getChildren);
router.get('/:commentId/like', tokenCheck, controllers.isLiked);

// POST /ideas/comments/
router.post('/', tokenCheck, controllers.postComment);
router.post('/:commentId/like', tokenCheck, controllers.commentLike);

module.exports = router;
