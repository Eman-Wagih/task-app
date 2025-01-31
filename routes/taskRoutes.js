const express = require('express');
const router = express.Router({mergeParams: true}); 
const taskControllers = require('../controllers/taskControllers')

router.route('/').get(taskControllers.getAllTasks).post(taskControllers.addTask);
router.route('/:id').get(taskControllers.getTask).patch(taskControllers.updateTask).delete(taskControllers.deleteTask);

module.exports = router