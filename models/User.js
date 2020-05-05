const sequelize = require('sequelize');
const db = require('../config/db');

const UserTable = db.define('user', {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
  },
  name: sequelize.TEXT,
  Rating: sequelize.REAL,
  BirthDate: sequelize.DATE,
  RegistrationDate: sequelize.DATE,
  Information: sequelize.STRING,
  Email: sequelize.STRING,
  Password: sequelize.STRING,
});

module.exports = User = db.model('user');
