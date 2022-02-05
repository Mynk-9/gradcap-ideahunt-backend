const router = require('express').Router();
const controllers = require('./../controllers/user.controller');

// TEMPORARY ROUTES
router.post('/', controllers.createUser);
router.get('/', controllers.getAll);

module.exports = router;
