const Sequelize = require('sequelize');

const Database = require('../db.js');

const TerminalWatch = Database.db.define('terminalwatch', {
	watchID: {
		type: Sequelize.UUID,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	command: Sequelize.STRING,
	message: Sequelize.STRING(2000),
	channelID: Sequelize.STRING
});

module.exports = TerminalWatch;
