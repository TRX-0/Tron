const winston = require('winston');
const moment = require('moment');
const chalk = require('chalk');
const config = require('../config.json');
require('winston-daily-rotate-file');

const capitaliseFirstLetter = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const winstonLogger = winston.createLogger({
	transports: [
		new (winston.transports.DailyRotateFile)({
			filename: config.folders.logs,
			datePattern: '/yyyy-MM-dd.log',
			level: 'debug',
			timestamp: () => {
				return `${moment().format('YYYY-MM-DD HH:mm:ss')}`;
			},
			formatter: options => {
				return `${chalk.bold.magenta(`[${options.timestamp()}]`)} - | ${capitaliseFirstLetter(options.level)} | ${options.message}`;
			},
			json: false
		}),
		new (winston.transports.Console)({
			level: 'verbose',
			prettyPrint: true,
			colorize: true,
			timestamp: () => {
				return `${moment().format('YYYY-MM-DD HH:mm:ss')}`;
			},
			formatter: options => {
				return `${chalk.bold.magenta(`[${options.timestamp()}]`)} - | ${capitaliseFirstLetter(options.level)} | ${options.message}`;
			}
		})
	]
});

module.exports = modName => {
	const myLogger = {
		error: text => {
			winstonLogger.error(`${modName} | ${chalk.bold.red(text)}`);
		},
		warn: text => {
			winstonLogger.info(`${modName} | ${chalk.keyword('orange')(text)}`);
		},
		info: text => {
			winstonLogger.info(`${modName} | ${text}`);
		},
		verbose: text => {
			winstonLogger.verbose(`${modName} | ${text}`);
		},
		debug: text => {
			winstonLogger.debug(`${modName} | ${text}`);
		},
		silly: text => {
			winstonLogger.silly(`${modName} | ${text}`);
		}
	};
	return myLogger;
};
