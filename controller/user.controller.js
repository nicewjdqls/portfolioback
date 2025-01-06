const userController = {};
const { connection } = require("../model/Task");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // jwt 라이브러리 추가
require('dotenv').config();  // .env 파일 로드

// 이메일과 비밀번호로 로그인
userController.loginWithEmail = async (req, res) => {
    console.log("Login attempt:", req.body);
    try {
        const { userId, userPw } = req.body;
        
        // MySQL 쿼리로 사용자 정보 조회
        const [rows] = await connection.promise().query(
            "SELECT * FROM USER WHERE userId = ?", 
            [userId]
        );

        if (rows.length === 0) {
            throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        
        const user = rows[0];  // 첫 번째 사용자 선택

        // 비밀번호 비교
        const isMatch = await bcrypt.compare(userPw, user.userPw);
        if (isMatch) {
            // 토큰 생성
            const token = userController.generateToken(user);  // user 객체를 넘겨서 토큰 생성
            return res.status(200).json({ status: "success", user, token });
        }
        
        throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// 로그인 후 사용자 정보 조회
userController.getUser = async (req, res) => {
    try {
        const { userId } = req; // 미들웨어에서 할당된 userId
        const [rows] = await connection.promise().query(
            "SELECT * FROM USER WHERE userId = ?", 
            [userId]
        );
        
        if (rows.length === 0) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        const user = rows[0];  // 첫 번째 사용자 선택
        console.log("User found:", user);
        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// JWT 토큰 생성 함수
userController.generateToken = (user) => {
    const payload = {
        userId: user.userId,  // 필요한 데이터 추가
        userName: user.userName // 예시: 사용자 이름 추가
    };
    const secretKey = process.env.JWT_SECRET_KEY ; // 환경 변수로 비밀 키 설정

    // JWT 토큰 생성
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // 1시간 유효한 토큰
};

module.exports = userController;
