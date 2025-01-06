const express = require('express');
const router = express.Router();
const SignUpController = require('../controller/SignUp.controller');

router.post('/', SignUpController.signUpUser);
router.get('/checkId/:id', SignUpController.checkIdUser);

module.exports = router; 