const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');  
const authController = require('../controller/auth.controller');  

// 로그인 API
router.post('/login', userController.loginWithEmail);  

// 로그인 후 사용자 정보 조회 (인증 미들웨어 사용)
router.get('/me', authController.authenticate, userController.getUser);  

module.exports = router;
