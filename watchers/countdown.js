exports.data = {
	name: 'Countdowns',
	nick: 'countdown',
	command: 'countdown'
};

const moment = require('moment');
const humanizeDuration = require('humanize-duration');
const chalk = require('chalk');
const Countdown = require('../lib/models/countdown');
const log = require('../lib/log.js')(exports.data.name);

let countdown;

exports.start = async (msg, bot, args) => {
	try {
		let timeDiff;
		if (!args[0]) {
			return msg.reply('You must supply a valid unix timestamp.');
		} else if (args.slice(1).join(' ').length <= 0) {
			return msg.reply('You must supply a description of the countdown.');
		}
		try {
			timeDiff = moment.unix(args[0]).diff();
		} catch (err) {
			log.warn(`User provided timestamp could not be parsed: ${err.stack}`);
			return msg.reply('The provided timestamp could not be parsed');
		}

		if (timeDiff > 0) {
			await Countdown.sync();
			const m = await msg.channel.send(`**Time until ${args.slice(1).join(' ')}:** ${humanizeDuration(timeDiff, {round: true})}`);
			Countdown.create({
				unixTime: moment.unix(args[0]),
				messageID: m.id,
				channelID: m.channel.id,
				description: args.slice(1).join(' ')
			});
			if (m.channel.permissionsFor(bot.user).has('MANAGE_MESSAGES')) {
				m.pin().catch(err => log.warn(`Failed to pin message: ${err.stack}`));
			}
		} else {
			await msg.reply('Provided timestamp references the past. Sadly I don\'t support time travel just yet.');
		}
	} catch (err) {
		log.error(`Could not add new countdown: ${err.stack}`);
	}
};

exports.list = async (msg, bot, args) => {
	const channelID = args[0] && bot.channels.has(args[0]) ? args[0] : msg.channel.id;
	const channel = bot.channels.get(args[0]) || msg.channel;
	const fields = (await Countdown.findAll({
		where: {channelID},
		order: [['unixTime', 'ASC']]
	})).map((watch, i) => {
		return {
			name: `ID ${i + 1}: ${watch.description}`,
			value: `Ends at: ${moment(watch.unixTime).utc().format('Do MMMM YYYY, HH:mm:ss')} UTC`
		};
	});
	if (fields.length > 0) {
		msg.reply('', {embed: {
			author: {
				name: `Countdowns running in #${channel.name} on ${channel.guild.name}`,
				icon_url: 'https://cdn.artemisbot.uk/img/clock.png'
			},
			fields,
			color: 0x993E4D,
			footer: {
				icon_url: 'https://cdn.artemisbot.uk/img/ocel.jpg',
				text: 'Ocel'
			}
		}});
	} else {
		msg.reply(`There are no countdowns in ${args[0] && bot.channels.has(args[0]) ? `#${channel.name} on ${channel.guild.name}` : 'this channel'}.`);
	}
};

exports.stop = async (msg, bot, args) => {
	try {
		const channelID = args[1] && bot.channels.has(args[1]) ? args[1] : msg.channel.id;
		const channel = bot.channels.get(args[1]) || msg.channel;
		if (args[0] ? args[0] <= 0 : false) {
			return msg.reply('Please provide a valid countdown ID. Check `ocel watcher list countdown` for a list of countdowns and their IDs.');
		}
		const countdowns = await Countdown.findAll({
			where: {
				channelID
			},
			order: [['unixTime', 'ASC']]
		});
		if (!countdowns[args[0] - 1]) {
			return msg.reply('Please provide a valid countdown ID. Check `ocel watcher list countdown` for a list of countdowns and their IDs.');
		}
		const selectedCountdown = countdowns[args[0] - 1];
		const countdownMessage = await channel.fetchMessage(selectedCountdown.messageID);
		msg.reply(`Countdown with ID ${args[0]} in ${args[1] && bot.channels.has(args[1]) ? `#${channel.name} on ${channel.guild.name}` : 'this channel'} has been cancelled.`);
		await countdownMessage.edit('**Countdown Cancelled.**');
		await countdownMessage.delete(5000);
		await selectedCountdown.destroy();
	} catch (err) {
		log.error(`Failed to stop countdown: ${err.stack}`);
		msg.reply('Failed to stop countdown.');
	}
};

exports.disable = () => {
	clearInterval(countdown);
};

exports.watcher = async bot => {
	this.disable();
	log.verbose(chalk.green(`${exports.data.name} has initialised successfully.`));
	countdown = setInterval(async () => {
		try {
			if (await Countdown.count() > 0) {
				(await Countdown.all()).forEach(async countdown => {
					try {
						const timeDiff = moment(countdown.unixTime).diff();
						const channel = bot.channels.get(countdown.channelID);
						const message = await channel.fetchMessage(countdown.messageID);
						if (timeDiff > 0) {
							await message.edit(`**Time until ${countdown.description}:** ${humanizeDuration(timeDiff, {round: true})}`);
						} else {
							const m = await message.edit(`It's time for ${countdown.description}!`);
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