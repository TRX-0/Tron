const Sequelize = require('sequelize');

const Database = require('../db.js');

const User = Database.db.define('user', {
	userID: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	name: Sequelize.STRING,
	discrim: Sequelize.STRING,
	guilds: Sequelize.ARRAY(Sequelize.STRING)
});

module.exports = User;
