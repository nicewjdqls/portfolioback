const { connection } = require("../model/Task"); // MySQL 데이터베이스 연결
const taskController = {};

// Task 생성 (POST /tasks)
taskController.createTask = async (req, res) => {
    try {
        const { task, isComplete, userId, userName } = req.body; // userId와 userName을 받아옵니다.
        
        // isComplete 값이 없으면 기본값 false로 설정
        const taskComplete = isComplete !== undefined ? isComplete : false;

        // MySQL 쿼리로 Task 생성
        const [result] = await connection.promise().query(
            "INSERT INTO tasks (task, isComplete, userId, userName) VALUES (?, ?, ?, ?)", // userId와 userName 추가
            [task, taskComplete, userId, userName]
        );

        const newTask = {
            id: result.insertId,
            task: task,
            isComplete: taskComplete,
            userId: userId,
            userName: userName
        };

        res.status(200).json({
            status: 'ok',
            data: newTask
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', error: err.message });
    }
};

// Task 조회 (GET /tasks)
taskController.getTask = async (req, res) => {
    try {
        const query = `SELECT id, task, isComplete, createdAt, userId, userName FROM tasks`;

        const [rows] = await connection.promise().query(query);

        if (rows.length === 0) {
            return res.status(404).json({ status: 'fail', message: 'No tasks found' });
        }

        res.status(200).json({ status: 'ok', data: rows });
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
