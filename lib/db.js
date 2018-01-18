const Sequelize = require('sequelize');
const config = require('../config.json');
const auth = require('../auth.json');
const log = require(`${config.folders.lib}/log.js`)('Database');

const database = new Sequelize(auth.DB.Database, auth.DB.User, auth.DB.Password, {
	host: auth.DB.Host,
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
