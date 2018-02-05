const Sequelize = require('sequelize');

const Database = require('../db.js');

const OTSroles = Database.db.define('otsroles', {
	guildId: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	roleId: Sequelize.STRING
});

module.exports = OTSroles;
