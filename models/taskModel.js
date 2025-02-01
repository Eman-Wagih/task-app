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
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
        }
    }
  });

  return Task;
};