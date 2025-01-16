const express = require('express');
const router = express.Router();
const signUpApi = require('./SignUpPage.api');
const userApi = require('./UserPage.api');
const taskApi = require('./Task.api');
const boardApi = require('./Board.api');

router.use('/signup', signUpApi);
router.use('/user', userApi);
router.use('/tasks', taskApi);
router.use('/board', boardApi);

module.exports = router;