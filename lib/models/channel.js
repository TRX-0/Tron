const Sequelize = require('sequelize');

const Database = require('../db.js');

const Channel = Database.db.define('channel', {
	channelID: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	name: Sequelize.STRING,
	guildID: Sequelize.STRING
});

module.exports = Channel;
