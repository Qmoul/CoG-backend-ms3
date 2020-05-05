const sequelize = require('sequelize');

module.exports = new sequelize('', 'root', '1234567', {
  dialect: 'mariadb',
});
