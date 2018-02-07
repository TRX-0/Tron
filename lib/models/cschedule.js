const Sequelize = require('sequelize');
const Database = require('../db.js');

const Cron = Database.db.define('schedule', {
	scheduleID: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	name: Sequelize.STRING,
	second: Sequelize.INTEGER,
	minute: Sequelize.INTEGER,
	hour: Sequelize.INTEGER,
	dayofmonth: Sequelize.INTEGER,
	month: Sequelize.INTEGER,
	dayofweek: Sequelize.INTEGER,
	description: Sequelize.STRING,
	created: {
		type: Sequelize.DATE,
		allowNull: false,
	}
});

module.exports = Cron;
