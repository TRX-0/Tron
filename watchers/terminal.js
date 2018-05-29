exports.data = {
	name: 'Waking Titan Terminal Watcher',
	command: 'terminal'
};

const Discord = require('discord.js');
const moment = require('moment');
const config = require('../config.json');
const TerminalWatch = require(`${config.folders.models}/terminalwatch`);
const wterminal = require(`${config.folders.commands}/Utilities/wterminal.js`).runCommand;
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

let repeat;


const checkCommands = async bot => {
	try {
		await TerminalWatch.sync();
		const terminalCommands = await TerminalWatch.findAll({attributes: ['command', 'message'], group: ['command', 'message']});
		log.debug(`Checking commands: ${terminalCommands.map(command => command.command).join(', ')}`);
		const result = await Promise.all(terminalCommands.map(async watch => {
			return new Promise(async (resolve, reject) => {
				try {
					const commandArr = watch.command.split(' ');
					const resp = await wterminal(commandArr[0], commandArr.slice(1));
					const statMsg = resp.data.redirect ? `[${resp.data.message.join('\n')}](${resp.data.redirect})` : `${resp.data.message.join('\n')}`;
					if (statMsg === watch.message) {
						// Log.debug(`Command \`${watch.command}\` has not changed.`);
						return resolve(false);
					}
					log.info(`Command \`${watch.command} has changed.`);
					const embed = new Discord.RichEmbed({
						author: {
							name: `The value of the ${watch.command} command has updated.`,
							icon_url: 'https://cdn.artemisbot.uk/img/hexagon.png',
							url: 'http://wakingtitan.com'
						},
						title: `**> \`${watch.command}\`**`,
						description: `\`${statMsg}\``,
						color: resp.success ? 0x00FC5D : 0xF00404,
						footer: {
							text: 'Watching Titan',
							icon_url: 'https://cdn.artemisbot.uk/img/watchingtitan.png'
						},
						timestamp: moment().toISOString()
					});
					await Promise.all((await TerminalWatch.findAll({where: {command: watch.command}})).map(watcher =>
						Promise.all([watcher.update({message: statMsg}), bot.channels.get(watcher.channelID).send('', {embed})])
					));
					resolve(true);
				} catch (err) {
					log.error(`Something went wrong: ${err}`);
					reject(err);
				}
			});
		}));
		if (!result.includes(true)) {
			log.debug('No commands have changed.');
		}
	} catch (err) {
		log.error('Failed to check all commands.');
	}
	repeat = setTimeout(async () => {
		checkCommands(bot);
	}, 15 * 1000);
};

exports.watcher = bot => {
	this.disable();
	repeat = setInterval(async () => {
		checkCommands(bot);
	}, 30 * 1000);
	log.verbose(`${exports.data.name} has initialised successfully.`);
};

exports.start = async (msg, bot, args) => {
	try {
		await TerminalWatch.sync();
		const command = args.join(' ');
		if (args.length === 0) {
			return msg.reply('You must provide at least 1 command for the bot to run.');
		}
		if (await TerminalWatch.findOne({where: {channelID: msg.channel.id, command}})) {
			return msg.reply(`I am already watching the \`${command}\` command in this channel.`);
		}
		const resp = await wterminal(args[0], args.slice(1));
		const message = resp.data.redirect ? `[${resp.data.message.join('\n')}](${resp.data.redirect})` : `${resp.data.message.join('\n')}`;
		log.info(`Now outputting \`${command}\` command updates to #${msg.channel.name} in ${msg.guild.name}.`);
		msg.reply(`Now outputting \`${command}\` command updates to this channel.`);
		await TerminalWatch.create({
			channelID: msg.channel.id,
			command,
			message
		});
	} catch (err) {
		msg.reply('Couldn\'t watch this command! Check the logs.');
		log.error(`Couldn't start watching a new command: ${err}`);
	}
};

exports.stop = async (msg, bot, args) => {
	const command = args.join(' ');
	if (args.length === 0) {
		return msg.reply('Please specify a command to stop watching.');
	}
	const watch = await TerminalWatch.findOne({where: {channelID: msg.channel.id, command}});
	if (watch) {
		watch.destroy();
		log.info(`No longer outputting \`${command}\` command updates to #${msg.channel.name} in ${msg.guild.name}.`);
		msg.reply(`No longer outputting \`${command}\` command updates to this channel.`);
	} else {
		return msg.reply(`This channel is not receiving updates on the \`${command}\` command.`);
	}
};

exports.list = async (msg, bot, args) => {
	const channelID = args[0] && bot.channels.has(args[0]) ? args[0] : msg.channel.id;
	const channel = bot.channels.get(args[0]) || msg.channel;
	const fields = (await TerminalWatch.findAll({where: {channelID}})).map(watch => {
		return {
			name: watch.command,
			value: `Created ${moment(watch.createdAt).fromNow()}`
		};
	});
	if (fields.length > 0) {
		msg.reply('', {embed: {
			title: `Terminal Watchers running in #${channel.name} on ${channel.guild.name}`,
			fields,
			color: 0x993E4D,
			footer: {
				icon_url: 'https://cdn.artemisbot.uk/img/ocel.jpg',
			}
		}});
	} else {
		msg.reply(`There are no terminal watchers in ${args[0] && bot.channels.has(args[0]) ? `#${channel.name} on ${channel.guild.name}` : 'this channel'}.`);
	}
};

exports.disable = () => {
	clearInterval(repeat);
};
