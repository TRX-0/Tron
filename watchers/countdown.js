exports.data = {
	name: 'Countdowns',
	command: 'countdown',
	description: 'Counts down to a specific moment in time.',
	syntax: '[start/stop/list/disable]',
};

const moment = require('moment');
const humanizeDuration = require('humanize-duration');
const chalk = require('chalk');

let countdown;

exports.start = async (message, client, args) => {
	const log = require(`${client.config.folders.lib}/log.js`)('Countdowns: Start');
	try {
		let timeDiff;
		if (!args[0]) {
			return message.reply('You must supply a valid unix timestamp.');
		} else if (args.slice(1).join(' ').length <= 0) {
			return message.reply('You must supply a description of the countdown.');
		}
		try {
			timeDiff = moment.unix(args[0]).diff();
			log.warn(`Difference between current time and timestamp is: ${timeDiff}`);
		} catch (err) {
			log.warn(`User provided timestamp could not be parsed: ${err.stack}`);
			return message.reply('The provided timestamp could not be parsed');
		}

		if (timeDiff > 0) {
			const m = await message.channel.send(`**Time until ${args.slice(1).join(' ')}:** ${humanizeDuration(timeDiff, {round: true})}`);
			client.CountdownModel.create({
				unixTime: moment.unix(args[0]),
				messageID: m.id,
				channelID: m.channel.id,
				description: args.slice(1).join(' ')
			});
			if (m.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) {
				m.pin().catch(err => log.warn(`Failed to pin message: ${err.stack}`));
			}
			log.info(`${message.author} has created a countdown in #${channel.name} on ${channel.guild.name}.`);
		} else {
			await message.reply('Provided timestamp references the past. Sadly I don\'t support time travel just yet.');
		}
	} catch (err) {
		log.error(`Could not add new countdown: ${err.stack}`);
	}
};

exports.list = async (message, client, args) => {
	const log = require(`${client.config.folders.lib}/log.js`)('Countdowns: List');
	let channel;
	if (message.mentions.channels.first() != undefined) {
		channel = message.mentions.channels.first();
	} else {
		channel = message.channel;
	}
	const channelID = channel.id;
	const fields = (await client.CountdownModel.findAll({
		where: {channelID},
		order: [['unixTime', 'ASC']]
	})).map((watch, i) => {
		return {
			name: `ID ${i + 1}: ${watch.description}`,
			value: `Ends at: ${moment(watch.unixTime).utc().format('Do MMMM YYYY, HH:mm:ss')} UTC`
		};
	});
	if (fields.length > 0) {
		message.reply('', {embed: {
			author: {
				name: `Countdowns running in #${channel.name} on ${channel.guild.name}`,
				icon_url: 'https://cdn.artemisbot.uk/img/clock.png'
			},
			fields,
			color: 0x993E4D,
		}});
	} else {
		message.reply(`There are no countdowns in ${args[0] && client.channels.cache.has(args[0]) ? `#${channel.name} on ${channel.guild.name}` : 'this channel'}.`);
	}
};

exports.stop = async (message, client, args) => {
	const log = require(`${client.config.folders.lib}/log.js`)('Countdowns: Stop');
	try {
		const channel = message.channel;
		const channelID = channel.id;
		if (args[0] ? args[0] <= 0 : false) {
			return message.reply('Please provide a valid countdown ID. Check `watcher list countdown` for a list of countdowns and their IDs.');
		}
		const countdowns = await client.CountdownModel.findAll({
			where: {
				channelID
			},
			order: [['unixTime', 'ASC']]
		});
		if (!countdowns[args[0] - 1]) {
			return message.reply('Please provide a valid countdown ID. Check `watcher list countdown` for a list of countdowns and their IDs.');
		}
		const selectedCountdown = countdowns[args[0] - 1];
		let countdownMessage;
		try {
			countdownMessage = await channel.messages.fetch(selectedCountdown.messageID);
		} catch (err) {
			log.warn('Countdown Message has already been deleted.');
		}
		if (countdownMessage != undefined ) {
			countdownMessage.delete();
		}
		await selectedCountdown.destroy();
		message.reply(`Countdown with ID ${args[0]} in #${channel.name} on ${channel.guild.name} has been cancelled.`);
		log.info(`Countdown with ID ${args[0]} in #${channel.name} on ${channel.guild.name} has been cancelled by ${message.author}.`);
	} catch (err) {
		log.error(`Failed to stop countdown: ${err.stack}`);
		message.reply('Failed to stop countdown.');
	}
};

exports.disable = () => {
	clearInterval(countdown);
};

exports.watcher = async client => {
	const log = require(`${client.config.folders.lib}/log.js`)('Countdowns: Watcher');
	this.disable();
	log.verbose(chalk.green(`${exports.data.name} has initialised successfully.`));
	countdown = setInterval(async () => {
		try {
			//Check if there are any countdowns
			if (await client.CountdownModel.count() > 0) {
				//Loop through the countdowns
				(await client.CountdownModel.findAll()).forEach(async countdown => {
					try {
						//Get the time difference from now till the time that the countdown ends
						const timeDiff = moment(countdown.unixTime).diff();
						//Get the channel where the countdown is happening
						const channel = client.channels.cache.get(countdown.channelID);

						//Check if the countdown message has not been deleted by accident
						let countdownMessage;
						try {
							countdownMessage = await channel.messages.fetch(countdown.messageID);
						} catch (err) {
							log.warn('Countdown Message has already been deleted. Deleting the countdown!');
							channel.send('Countdown Message has been deleted. Deleting the countdown!');
							return await countdown.destroy();
						}
						if (timeDiff > 0) {
							await countdownMessage.edit(`**Time until ${countdown.description}:** ${humanizeDuration(timeDiff, {round: true})}`);
						} else {
							const m = await countdownMessage.edit(`It's time for ${countdown.description}!`);
							m.delete(60000);
							channel.send(`It's time for ${countdown.description}!`);
							await countdown.destroy();
						}
					} catch (err) {
						log.error(`Could not update countdowns: ${err.stack}`);
					}
				});
			}
		} catch (err) {
			log.error(`Could not update countdowns: ${err.stack}`);
		}
	}, 10000);
};