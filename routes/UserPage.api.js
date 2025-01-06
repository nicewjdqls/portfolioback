const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');  // taskController -> userController로 변경
const authController = require('../controller/auth.controller');  // authController 그대로 사용

// 로그인 API
router.post('/login', userController.loginWithEmail);  // taskController -> userController로 변경

// 로그인 후 사용자 정보 조회 (인증 미들웨어 사용)
router.get('/me', authController.authenticate, userController.getUser);  // taskController -> userController로 변경

module.exports = router;
