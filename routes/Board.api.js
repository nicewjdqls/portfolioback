const express = require('express');
const router = express.Router();
const boardController = require('../controller/BoardController');
const authController = require('../controller/auth.controller');
const getApiKey = require('../controller/keyController');

// 게시글 작성
router.post('/create', authController.authenticate, boardController.createPost);

// 게시글 목록 조회
router.get('/', boardController.getAllPosts);

// 게시글 상세 조회
router.get('/post/:id', boardController.getPostById);  // 수정된 경로

// 게시글 수정
router.put('/edit/:id', authController.authenticate, boardController.updatePost);

// 게시글 삭제
router.delete('/:id', boardController.deletePost);

// 키값인증
router.get('/get-api-key', getApiKey);
module.exports = router;
