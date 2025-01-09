const { connection } = require("../model/Task"); // MySQL 데이터베이스 연결
const taskController = {};

// Task 생성 (POST /tasks)
taskController.createTask = async (req, res) => {
    try {
        const { task, isComplete, userId, userName } = req.body; // userId와 userName을 받아옵니다.
        console.log("추가버튼 내용 확인", req.body);

        // 비회원일 경우 userId와 userName을 'none'과 '비회원'으로 설정
        const finalUserId = userId === 'none' ? 'none' : userId;
        const finalUserName = userName === '비회원' ? '비회원' : userName;

        // isComplete 값이 없으면 기본값 false로 설정
        const taskComplete = isComplete !== undefined ? isComplete : false;

        // MySQL 쿼리로 Task 생성
        const [result] = await connection.promise().query(
            "INSERT INTO tasks (task, isComplete, userId, userName) VALUES (?, ?, ?, ?)", // userId와 userName 추가
            [task, taskComplete, finalUserId, finalUserName]
        );

        const newTask = {
            id: result.insertId,
            task: task,
            isComplete: taskComplete,
            userId: finalUserId,
            userName: finalUserName
        };

        res.status(200).json({
            status: 'ok',
            data: newTask
        });
    } catch (err) {
        console.error("서버 오류:", err.message);
        res.status(400).json({ status: 'fail', error: err.message });
    }
};

// Task 조회 (GET /tasks)
taskController.getTask = async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query; // page와 limit을 쿼리 파라미터로 받음
        const offset = (page - 1) * limit; // 시작 인덱스 계산

        const query = `
            SELECT id, task, isComplete, createdAt, userId, userName 
            FROM tasks
            LIMIT ? OFFSET ?
        `;

        const [rows] = await connection.promise().query(query, [parseInt(limit), parseInt(offset)]);

        const [totalRows] = await connection.promise().query('SELECT COUNT(*) AS total FROM tasks'); // 총 데이터 수

        const totalPages = Math.ceil(totalRows[0].total / limit); // 총 페이지 수 계산

        if (rows.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'No tasks found' });
        }

        res.status(200).json({
            status: 'ok',
            data: rows,
            totalPages,  // 추가: 총 페이지 수 포함
            currentPage: parseInt(page),  // 현재 페이지 정보
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err.message });
    }
};

// Task 업데이트 (PUT /tasks/:id)
taskController.putTask = async (req, res) => {
    try {
        const { id } = req.params; // URL에서 Task ID 가져오기
        const { isComplete } = req.body; // 완료 상태만 업데이트

        // isComplete 값이 boolean인지 확인
        if (typeof isComplete !== 'boolean') {
            return res.status(400).json({ status: 'fail', message: 'isComplete must be a boolean' });
        }

        const [result] = await connection.promise().query(
            "UPDATE tasks SET isComplete = ? WHERE id = ?",
            [isComplete, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'fail', message: 'Task not found or no changes made' });
        }

        res.status(200).json({ status: 'ok', message: 'Task updated successfully' });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err.message });
    }
};

// Task 삭제 (DELETE /tasks/:id)
taskController.delTask = async (req, res) => {
    try {
        const { id } = req.params; // URL에서 Task ID 가져오기
        const { userId } = req.body; // 요청 본문에서 userId 받기

        console.log("삭제 버튼로그", req.body);
        console.log("삭제 버튼로그2", userId);
        // 해당 task의 작성자 정보 가져오기
        const [task] = await connection.promise().query(
            "SELECT userId FROM tasks WHERE id = ?",
            [id]
        );

        // 작업이 존재하지 않거나 userId가 일치하지 않으면 에러
        if (task.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'Task not found' });
        }

        if (task[0].userId !== userId) {
            return res.status(403).json({ status: 'fail', message: '직접 작성한 글만 삭제 가능합니다.' });
        }

        // 삭제 쿼리 실행
        const [result] = await connection.promise().query(
            "DELETE FROM tasks WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'fail', message: 'Task not found' });
        }

        res.status(200).json({ status: 'ok', message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err.message });
    }
};

module.exports = taskController;
