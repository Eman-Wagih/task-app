const express = require('express');
const router = express.Router(); 
const userControllers = require('../controllers/userController');
const tasksRouter = require('./taskRoutes')

router.route('/:userId/tasks').get(userControllers.getUserTasks)

router.route('/').get(userControllers.getAllUsers).post(userControllers.validateEmail, userControllers.addUser)
router.route('/:id').get(userControllers.getUser).patch(userControllers.validateEmail, userControllers.editUser).delete(userControllers.deleteUser)

module.exports = router