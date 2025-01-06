const { connection } = require('../model/Task');

async function signUpUser(req, res) {
    const {userId, userPw, userName, userPhone} = req.body;
 
       // 유효성 검사
       if (!userId || !userPw || !userName || !userPhone) {
        console.log(req.body);
        return res.status(400).json({ success: false, message: '빈칸을 다 채워주세요' });
    }

    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const hashedPw = await bcrypt.hash(userPw, saltRounds);

    const query = "INSERT INTO USER(userId, userPw,userName,userPhone) VALUES (?,?,?,?);"
    const values = [userId, hashedPw,userName,userPhone];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('회원가입 오류:', error);
            return res.status(500).json({ success: false, message: '회원가입 실패' });
        }
        return res.status(200).json({ success: true, message: '회원가입 성공' });
    });
}

async function checkIdUser(req, res) {
    const {id} = req.params;
    console.log(`아이디 중복 체크 요청: ${id}`);  // 로그 추가

    const query = 'SELECT userId FROM USER WHERE userId = ?';
    connection.query(query, [id], (error, results) =>{
        if(error){
            console.error('중복 체크 오류:', error);
            return res.status(500).json({success: false, message: '서버 오류가 발생했습니다.'});
        }
        if (results.length > 0){
            res.status(200).json({success: false, message: '중복된 아이디입니다.'});
        } else{
            res.status(200).json({success: true, message: '사용 가능한 아이디입니다.'});
        }
    });
}

module.exports = {
    signUpUser, checkIdUser
};