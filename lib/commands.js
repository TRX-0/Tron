const Sequelize = require('sequelize');
const Database = require('./db.js');

const Commands = Database.db.define('commands', {
	commandID: {
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
	name: Sequelize.STRING,
	enabled: Sequelize.BOOLEAN,
});

module.exports = Commands;
