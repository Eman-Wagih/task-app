const { Sequelize } = require('sequelize');
const User = require('./models/userModel');
const Task = require('./models/taskModel');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: `${process.env.PG_HOST}`,
    username: `${process.env.PG_USER}`,
    password:  `${process.env.PG_PASSWORD}`, 
    database: `${process.env.PG_DATABASE}`,
});

const models = {
    User: User(sequelize),
    Task: Task(sequelize)
};

async function createTable() {
    try {
      await sequelize.sync({ force: false });
      console.log('Table created successfully');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }
  
createTable();

module.exports = { sequelize, ...models };
