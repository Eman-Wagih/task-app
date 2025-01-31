const pool = require('../db');

const createTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS tasks (
        task_id SERIAL PRIMARY KEY,
        employeeId INT NOT NULL,
        description VARCHAR(150) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        CHECK (end_date > start_date),
        CONSTRAINT fk_user FOREIGN KEY (employeeId) REFERENCES users(id) ON DELETE CASCADE
      );`;
  
    try {
      await pool.query(query);
      console.log("Table created successfully!");
    } catch (err) {
      console.error("Error creating table:", err.message);
    } 
};

exports.getAllTasks = async (req, res) => {
    let tasks;
    try {
        tasks = await pool.query('SELECT * FROM tasks');
        res.status(200).send({
            status: 'sucess', 
            tasks: tasks.rows
        })
    } catch (err) {
        if (!tasks) err.message = 'no tasks were found'
        res.status(404).send({
            err: err.message
        })
    }
};


exports.addTask = async (req, res) => {
    await createTable();
    const {employeeId} = req.body || req.params.employeeId
    const {description, start_date, end_date} = req.body
    try { 
        let task = await pool.query(`INSERT INTO tasks (employeeId, description, start_date, end_date) VALUES ($1, $2, $3, $4)
                                     RETURNING *`, [employeeId, description, start_date, end_date]); 
        res.status(200).send({
            status: 'sucess', 
            task: task.rows[0]
        })

    } catch (err) {
        res.status(400).send({
            status: 'faild',
            messgae: err
        })
    }
};

exports.getTask = async (req, res) => {
    try {
        const task = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [req.params.id]);
        if (task.rows.length === 0) {
            res.status(404).send({
                status: 'faild',
                message: 'no task was found'
            })}
        res.status(200).send({
            status: 'sucess', 
            task: task.rows[0]
        })
    } catch (err) {
        console.log(err)
    }
}

exports.updateTask = async (req, res) => {
    const {employeeId, description, start_date, end_date } = req.body;  
    const taskId = req.params.id;  
    try {
        const result = await pool.query (
            `UPDATE tasks
             SET employeeId = COALESCE($1, employeeId), description = COALESCE($2, description), 
             start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date)
             WHERE id = $5
             RETURNING *`, 
            [employeeId, description, start_date, end_date, taskId]
        );
        if (result.rows.length > 0) {
            res.status(200).send({
                status: 'success',
                task: result.rows[0]  
            });
        } else {
            res.status(404).send({
                status: 'fail',
                message: 'task not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            status: 'failed',
            message: err
        });
    }
}

exports.deleteTask = async (req, res) => {
    const taskId =  req.params.id; 
    try {
        await pool.query(`DELETE FROM tasks WHERE id = $1 RETURNING *`, [taskId]);
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