const { Model, DataTypes, Sequelize } = require('sequelize');

class User extends Model {}

module.exports = (sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      allowNull: false
    }, 
    job_title: {
        type: DataTypes.STRING,
        allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }, {
    createdAt: false,
    updatedAt: false,
  });

  return User;
};