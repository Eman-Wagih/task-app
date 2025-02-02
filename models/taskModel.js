const { Model, DataTypes, Sequelize } = require('sequelize');

class Task extends Model {}

module.exports = (sequelize) => {
  Task.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    }, 
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User', 
        key: 'id'   
      }
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: false,
    hooks: {
        beforeValidate(task) {
            if (task.end_date < task.start_date) {
                throw new Error('End date can’t be before start date');
            }
            const taskHours = (new Date(task.end_date) - new Date(task.start_date)) / (1000 * 60 * 60);
        
            if (taskHours > 8) {
              throw new Error('Task duration cannot exceed 8 hours.');
            }
        }
    }
  });

  return Task;
};