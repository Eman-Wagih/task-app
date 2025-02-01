const pool = require('../db');
const { sequelize, Task } = require('../sequelize');


exports.getAllTasks = async (req, res) => {
    let tasks;
    try {
        tasks = await Task.findAll()
        res.status(200).send({
            status: 'sucess', 
            tasks
        })
    } catch (err) {
        if (!tasks) err.message = 'no tasks were found'
        res.status(404).send({
            err: err.message
        })
    }
};


exports.addTask = async (req, res) => {
    const {employeeId} = req.body || req.params.employeeId
    const {description, start_date, end_date} = req.body
    try { 
        let task = await Task.create({description, start_date, end_date, employeeId})
        await task.save(); 
        res.status(200).send({
            status: 'sucess', 
            task
        })
    } catch (err) {
        console.log(err)
        res.status(400).send({
            status: 'faild',
            messgae: err.message
        })
    }
};

exports.getTask = async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findOne({where: {id}});
        if (!task) {
            res.status(404).send({
                status: 'faild',
                message: 'no task was found'
            })}
        else {
            res.status(200).send({
                status: 'sucess', 
                task
            })    
        }
    } catch (err) {
        console.log(err)
        res.status(400).send({
            status: 'faild',
            messgae: err.message
        })
    }
}

exports.updateTask = async (req, res) => {
    const {employeeId, description, start_date, end_date } = req.body;  
    const id = req.params.id;  
    try {
       const task = await Task.findOne({where: {id}})
        await task.update(req.body)
        res.status(404).send({
            status: 'fail',
            task
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: 'failed',
            message: err.message
        });
    }
}

exports.deleteTask = async (req, res) => {
    const id =  req.params.id; 
    try {
        await Task.destroy({where: {id}})
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