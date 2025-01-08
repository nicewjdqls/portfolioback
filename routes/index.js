const express = require('express');
const router = express.Router();
const signUpApi = require('./SignUpPage.api');
const userApi = require('./UserPage.api');
const taskApi = require('./Task.api');

router.use('/signup', signUpApi);
router.use('/user', userApi);
router.use('/tasks', taskApi);


module.exports = router;