const Sequelize = require('sequelize');

const Database = require('../db.js');

const Emote = Database.db.define('operation', {
	operationID: {
		type: Sequelize.UUID,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	name: Sequelize.STRING,
	roleID: Sequelize.STRING,
	guildID: Sequelize.STRING
});

module.exports = Emote;
