const pool = require('../db');
const validator = require('validator')


const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) NOT NULL,
      email VARCHAR(30) UNIQUE NOT NULL,
      job_title VARCHAR(20) NOT NULL,
      CHECK (length(name) >= 3)
    );`;

  try {
    await pool.query(query);
    console.log("Table created successfully!");
  } catch (err) {
    console.error("Error creating table:", err.message);
  } 
};

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
        users = await pool.query('SELECT * FROM users');
        res.status(200).send({
            status: 'sucess', 
            users: users.rows
        })
    } catch (err) {
        if (users.rows.length == 0) err.message = 'no users were found'
        res.status(404).send({
            err: err.message
        })
    }
};

exports.addUser = async (req, res) => {
    await createTable();
    const {name, email, jobTitle} = req.body
    try { 
        let user = await pool.query(`INSERT INTO users (name, email, job_title) VALUES ($1, $2, $3) RETURNING *`, [name, email, jobTitle]); 
        res.status(200).send({
            status: 'sucess', 
            user: user.rows[0]
        })

    } catch (err) {
        res.status(400).send({
            status: 'faild',
            messgae: err
        })
    }
};

exports.getUser = async (req, res) => {
    try {
        const result  = await pool.query('SELECT * FROM users u left join tasks t on u.id = t.employeeId WHERE u.id = $1', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
              status: "fail",
              message: `No user found`,
            });
          }
          const user = result.rows[0];  
          const tasks = result.rows
            .filter(row => row.id)  
            .map(row => ({
              task_id: row.id,
              description: row.description,
              start_date: row.start_date,
              end_date: row.end_date,
            }));
            console.log(tasks)
          res.status(200).json({
            status: "success",
            user: {
              user_id: user.user_id,
              name: user.name,
              email: user.email,
              job_title: user.job_title,
              tasks: tasks,
            },
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
    const { name, email, jobTitle } = req.body;  
    const userId = req.params.id;  
    try {
        const result = await pool.query (
            `UPDATE users
             SET name = COALESCE($1, name), email = COALESCE($2, email), job_title = COALESCE($3, job_title)
             WHERE id = $4
             RETURNING *`, 
            [name, email, jobTitle, userId]
        );
        if (result.rows.length > 0) {
            res.status(200).send({
                status: 'success',
                user: result.rows[0]  
            });
        } else {
            res.status(404).send({
                status: 'fail',
                message: 'User not found'
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

exports.deleteUser = async (req, res) => {
    const userId = req.params.id; 
    try {
        await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);
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