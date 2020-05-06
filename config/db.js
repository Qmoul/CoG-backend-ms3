const sequelize = require('sequelize');

module.exports = new sequelize('cog', 'root', '1234567', {
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT+7',
  },
  define: {
    timestamps: false
}
});