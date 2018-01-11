const Sequelize = require('sequelize');

const Database = require('../db.js');

const Watcher = Database.db.define('watcher', {
	watcherName: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	globalEnable: Sequelize.BOOLEAN,
	disabledGuilds: Sequelize.ARRAY(Sequelize.STRING),
	data: Sequelize.JSON
});

module.exports = Watcher;
