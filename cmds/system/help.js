exports.data = {
	name: 'Help',
	description: 'Lists available commands.',
	group: 'system',
	command: 'help',
	syntax: 'help [optional:command]',
	author: 'Matt C: matt@artemisbot.uk',
	permissions: 0,
	anywhere: false
};

const Discord = require('discord.js');
const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Server = require(`${config.folders.models}/server.js`);

exports.func = async (msg, args, bot) => {
	const server = await Server.findOne({where: {guildId: msg.guild.id}});
	const commands = bot.commands.keys();
	const spec = args[0] || null;
	const help = new Discord.RichEmbed({
		color: 2212073
	});
	const elevation = await bot.elevation(msg);
	let hiddenE = 0;
	let hiddenS = 0;
	let footer = '';
	let cmdList = `*The prefix before each command can be exchanged with \`@${bot.user.username}#${bot.user.discriminator} [command]\`*\n`;
	let cmdData;
	let prefix = `${config.prefix} `;
	let dm;
	if (server.altPrefix) {
		prefix = server.altPrefix;
		cmdList = `*The prefix before each command can be exchanged with \`@${bot.user.username}#${bot.user.discriminator} [command]\` or \`${config.prefix} [command]\`.*\n`;
	}
	try {
		if (spec) {
			if (!bot.commands.has(spec)) {
				return msg.reply('The specified command does not exist.');
			}
			log.verbose(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has requested additional info on !${spec} in #${msg.channel.name} on ${msg.guild.name}.`);
			cmdData = bot.commands.get(spec).data;
			if (elevation < cmdData.permissions) {
				return msg.reply('You do not have permissions to view this command.');
			} else if (!((!cmdData.asOnly || msg.guild.id === '263785005333872640') &&
			(cmdData.group === 'emotes' ? server.emotes : true) &&
			(cmdData.group === 'quotes' ? server.quotes : true))) {
				return msg.reply('This command is not enabled in your server.');
			}
			help.setTitle(`__${cmdData.name} Command__`);
			help.addField('Description', cmdData.description, true);
			help.addField('Syntax', `${prefix}${cmdData.syntax}`, true);
			help.addField('Author', cmdData.author, true);
			await msg.reply('', {embed: help});
		} else {
			help.setTitle(`__Commands in ${msg.guild.name}.__`);
			log.verbose(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has listed the available commands in #${msg.channel.name} on ${msg.guild.name}.`);
			for (const command of commands) {
				cmdData = bot.commands.get(command).data;
				if (elevation >= cmdData.permissions &&
					(!cmdData.asOnly || msg.guild.id === '263785005333872640') &&
					(cmdData.group === 'emotes' ? server.emotes : true) &&
					(cmdData.group === 'quotes' ? server.quotes : true)) {
					cmdList += `\`${prefix}${cmdData.syntax}\` - ${cmdData.description}\n`;
				} else if (!(command === 'quote' || command === 'emote') && elevation < cmdData.permissions) {
					hiddenE++;
				} else if (cmdData.asOnly || !server.emotes || !server.quotes) {
					hiddenS++;
				}
			}
			if (hiddenE > 0) {
				footer += `${hiddenE} command(s) were not shown due to your permission level. `;
			}
			if (hiddenS > 0) {
				footer += `${hiddenS} command(s) were not shown due to your current guild. `;
			}
			if (footer.length > 0) {
				help.setFooter(footer.slice(0, -1));
			}
			help.setDescription(cmdList.slice(0, -1));
			dm = await msg.author.createDM();
			await dm.send('If you can\'t see any commands listed, make sure you have link previews enabled in **Settings** -> **Text & Images**.', {
				embed: help
			}).then(() => msg.reply('I have DMed you with the avaliable commands in this server.')).catch(err => {
				log.error(`Could not DM user: ${err}.`);
				msg.reply(`I could not DM you, please check your settings.`);
			});
		}
	} catch (err) {
		log.error(`Error: ${err}.`);
	}
};
