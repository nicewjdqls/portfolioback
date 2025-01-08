const express = require('express');
const taskController = require('../controller/Task.controller');
const router = express.Router();


router.post('/',taskController.createTask);
router.get('/',taskController.getTask);
router.put('/:id', taskController.putTask);
router.delete('/:id',taskController.delTask);


module.exports = router;