const { connection } = require('../model/Task');  // MySQL 연결
const jwt = require('jsonwebtoken');

// 모든 게시글 조회
const getAllPosts = (req, res) => {
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';  // 게시글 최신순 정렬
    connection.query(query, (err, results) => {
        if (err) {
            console.error('게시글 조회 실패:', err);
            return res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
        }
        res.status(200).json(results);  // 결과 반환
    });
};

// 특정 게시글 조회
const getPostById = (req, res) => {
    const { id } = req.params;  // URL 파라미터에서 id 가져오기
    const query = 'SELECT * FROM posts WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('게시글 조회 실패:', err);
            return res.status(500).json({ message: '게시글 조회에 실패했습니다.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json(results[0]);  // 해당 게시글 반환
    });
};
// 게시글 작성
const createPost = (req, res) => {
    const { title, content } = req.body;

    // 요청에서 사용자 ID 가져오기
    const author = req.userId;

    if (!author) {
        return res.status(401).json({ message: '로그인 후 게시글을 작성할 수 있습니다.' });
    }

    const query = 'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)';
    connection.query(query, [title, content, author], (err, result) => {
        if (err) {
            console.error('게시글 작성 실패:', err);
            return res.status(500).json({ message: '게시글 작성에 실패했습니다.' });
        }
        res.status(201).json({ message: '게시글이 작성되었습니다.', postId: result.insertId });
    });
};

// 게시글 수정
const updatePost = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body; // 수정할 제목과 내용 받기
  
    // 데이터베이스 쿼리
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
    connection.query(query, [title, content, id], (err, result) => {
      if (err) {
        console.error('게시글 수정 실패:', err);
        return res.status(500).json({ message: '게시글 수정에 실패했습니다.' });
      }
  
      // 수정된 데이터가 없으면 404 처리
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }
  
      res.status(200).json({ message: '게시글이 수정되었습니다.' });
    });
  };

// 게시글 삭제
const deletePost = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM posts WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('게시글 삭제 실패:', err);
            return res.status(500).json({ message: '게시글 삭제에 실패했습니다.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '게시글이 삭제되었습니다.' });
    });
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};
