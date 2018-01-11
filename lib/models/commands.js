const Sequelize = require('sequelize');
const Database = require('../db.js');

const Commands = Database.db.define('commands', {
	guildId: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	name: Sequelize.STRING,
	enabled: Sequelize.BOOLEAN,
});

module.exports = Commands;
