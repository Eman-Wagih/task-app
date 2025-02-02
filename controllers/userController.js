const validator = require('validator')
const { sequelize, User, Task } = require('../sequelize');


User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User);

exports.validateEmail = (req, res, next) => {
    const isEmail = validator.isEmail(req.body.email);
    console.log(isEmail)
    if (!isEmail) {
        const error = new Error('Please enter a valid email');
        error.status = 400;
        return next(error)
    }
    next()
} 

exports.getAllUsers = async (req, res) => {
    let users;
    try {
        users = await User.findAll();
        res.status(200).send({
            status: 'sucess', 
            users
        })
    } catch (err) {
        if (users.length == 0) err.message = 'no users were found'
        res.status(404).send({
            err: err.message
        })
    }
};

exports.addUser = async (req, res) => {
    const {name, email, job_title} = req.body
    try {
        const user = await User.create({name, email, job_title})
        await user.save(); 
        console.log(user, 'user'); 

        res.status(200).send({
            status: 'success', 
            user
        })
    } catch (err) {
        res.status(400).send({
            status: 'faild',
            messgae: err
        })
    }
};

exports.getUser = async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({
            where: { id },
            include: [{
              model: Task,
              as: 'tasks'
            }]
          });
        if (!user) {
            return res.status(404).json({
              status: "fail",
              message: `No user found`,
            });
          }
          res.status(200).json({
            status: "success",
            user
    });
    } catch(err) {
        console.log(err)
        res.status(500).send({
            status: 'fail',
            message: 'Error fetching user, try again later'
        });
    }
}

exports.editUser = async (req, res) => {
    // const { name, email, jobTitle } = req.body;  
    const id = req.params.id;  
    try {
        const user = await User.findOne({where: {id}})
        if (!user) {
            res.status(404).send({
                status: 'fail',
                message: 'User not found'
            });
        }
        await user.update(req.body)
        res.status(200).send({
            status: 'success',
            user
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: 'failed',
            message: err
        });
}}

exports.deleteUser = async (req, res) => {
    const id = req.params.id; 
    try {
        await User.destroy({where: {id}})
        res.status(204).send({
            status: 'sucess'
        })
    } catch (err) {
        res.status(404).send({
            status: 'faild', 
            err: err.message
        })
    }

}

exports.getUserTasks = async (req, res) => {
    try { 
    const userId = Number(req.params.userId); 
    const tasks = await Task.findAll({ where: { employeeId:  userId} });
    res.status(200).send({
        status: 'sucess', 
        tasks
    })
    } catch(err) {
        res.status(500).send({
            status: 'faild',
            err: err.message
        })
    }

}