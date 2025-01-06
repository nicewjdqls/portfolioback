const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // JWT
const indexRouter = require('./routes/index'); // 라우터 파일 연결
const { connection } = require('./model/Task'); // MySQL 연결 설정

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", indexRouter); // /api로 시작하는 라우트 처리

// MySQL 연결
connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
        return;
    }
    console.log('MySQL 연결 성공!');
    StartServer();
});

function StartServer() {
    app.listen(5000, () => {
        console.log('서버가 포트 5000에서 실행중입니다.');
    });
}
