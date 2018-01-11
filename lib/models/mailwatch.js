const Sequelize = require('sequelize');

const Database = require('../db.js');

const TwitchWatch = Database.db.define('mailwatch', {
	watchID: {
		type: Sequelize.UUID,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	address: Sequelize.STRING,
	channelID: Sequelize.STRING
});

module.exports = TwitchWatch;
