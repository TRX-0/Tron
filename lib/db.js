const Sequelize = require('sequelize');
const config = require('../config.json');
const log = require('./log.js')('Database');

const database = new Sequelize('tron', 'postgres', config.dbPass, {
	host: 'localhost',
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	logging: null,
	operatorsAliases: false
});

class Database {
	static get db() {
		return database;
	}

	static start() {
		database.authenticate()
			.then(() => log.info('Connection to database has been established successfully.'))
			.then(() => log.verbose('Synchronising database...'))
			.then(() => database.sync()
				.then(() => log.info('Done Synchronising database!'))
				.catch(error => log.error(`Error synchronising the database: \n${error}`))
			)
			.catch(err => {
				log.error(`Unable to connect to the database: \n${err}`);
				log.error(`Will try to reconnect in 5 seconds...`);
				setTimeout(() => Database.start(), 5000);
			});
	}
}

module.exports = Database;
