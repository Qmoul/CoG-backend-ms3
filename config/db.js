const sequelize = require('sequelize');

module.exports = new sequelize('cog', 'root', '1234567', {
  dialect: 'mariadb',
});
