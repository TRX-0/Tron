const Sequelize = require('sequelize');

const Database = require('../db.js');

const Countdown = Database.db.define('countdowns', {
	countdownID: {
		type: Sequelize.UUID,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	unixTime: Sequelize.DATE,
	messageID: Sequelize.STRING,
	description: Sequelize.STRING,
	channelID: Sequelize.STRING
});

module.exports = Countdown;