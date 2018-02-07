const Sequelize = require('sequelize');

const Database = require('../db.js');

const Server = Database.db.define('server', {
	guildId: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	name: Sequelize.STRING,
	altPrefix: Sequelize.STRING,
	perm3: Sequelize.ARRAY(Sequelize.STRING),
	perm2: Sequelize.ARRAY(Sequelize.STRING),
	perm1: Sequelize.ARRAY(Sequelize.STRING),
});

module.exports = Server;
