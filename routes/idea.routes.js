const router = require('express').Router();
const controllers = require('./../controllers/idea.controllers');

// GET /ideas
router.get('/', controllers.getAll);

// POST /ideas
router.post('/', controllers.postOne);

module.exports = router;
