const Sequelize = require('sequelize');
const Database = require('../db.js');

const Profiles = Database.db.define('profiles', {
	profileID: {
		type: Sequelize.UUID,
		primaryKey: true,
		allowNull: false,
		unique: true,
		defaultValue: Sequelize.UUIDV4
	},
	guildId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	username: Sequelize.STRING,
	msgcount: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	discordid: Sequelize.STRING,
	wordsSolved: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	admin: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

module.exports = Profiles;