const express = require('express');
const router = express.Router();
const signUpApi = require('./SignUpPage.api');
const userApi = require('./UserPage.api');

router.use('/signup', signUpApi);
router.use('/user', userApi);


module.exports = router;