const Sequelize = require('sequelize');

const Database = require('../db.js');

const OTS = Database.db.define('mute', {
	guildId: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	roleId: Sequelize.STRING,
	mutedChannelId: Sequelize.STRING,
	botspamChannelId: Sequelize.STRING
});

module.exports = OTS;
