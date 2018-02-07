const Sequelize = require('sequelize');
const Database = require('../db.js');

const Date = Database.db.define('dschedule', {
	scheduleID: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	guildID: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	type: Sequelize.STRING, //Reminder, OTS
	name: Sequelize.STRING, //Who to remind or who to un-OTS
	information: Sequelize.STRING, //Thing to remind or OTS reason
	execute: {
		type: Sequelize.DATE,
		allowNull: false
	},
	created: {
		type: Sequelize.DATE,
		allowNull: false,
	}
});

module.exports = Date;
