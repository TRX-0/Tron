const Sequelize = require('sequelize');
const Database = require('../db.js');

const WordGame = Database.db.define('wordgame', {
	guildID: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false,
		unique: true
	},
	wordsSolved: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	prevWord: Sequelize.STRING,
	currentWord: Sequelize.STRING,
	prevWordSolvedTime: Sequelize.TIME,
	lastSolvedBy: Sequelize.STRING,
	playing: Sequelize.BOOLEAN
});

module.exports = WordGame;