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
const Commands = require(`${config.folders.models}/commands.js`);
const jetpack = require('fs-jetpack');

exports.func = async (msg, args, bot) => {
	const server = await Server.findOne({where: {guildId: msg.guild.id}});
	const spec = args[0] || null;
	const help = new Discord.RichEmbed({
		color: 2212073
	});
	const elevation = await bot.elevation(msg);
	let cmdData;
	let prefix = `${config.prefix} `;
	let dm;
	
	try {
		//If help is requested for a specific command
		if (spec) {
			if (!bot.commands.has(spec)) {
				return msg.reply('The specified command does not exist.');
			}
			log.info(`${spec}`);
			cmdData = bot.commands.get(spec).data;
			if (elevation < cmdData.permissions) {
				return msg.reply('You do not have permissions to view this command.');
			} else if (!(!cmdData.asOnly || msg.guild.id === '263785005333872640')) {
				return msg.reply('This command is not enabled in your server.');
			}
			help.setTitle(`__${cmdData.name} Command__`);
			help.addField('Description', cmdData.description, true);
			help.addField('Syntax', `${prefix}${cmdData.syntax}`, true);
			help.addField('Author', cmdData.author, true);
			await msg.reply('', {embed: help});

			log.verbose(`${msg.member.displayName} (${msg.author.tag}) has requested additional info on !${spec} in #${msg.channel.name} on ${msg.guild.name}.`);
		} else {
			help.setTitle(`__Commands in ${msg.guild.name}.__`);
			if (server.altPrefix) {
				prefix = server.altPrefix;
				help.setDescription(`*The prefix before each command can be exchanged with \`@${bot.user.tag} [command]\` or \`${config.prefix} [command]\`.*\n`);
			} else {
				help.setDescription(`*The prefix before each command can be exchanged with \`@${bot.user.tag} [command]\`*\n`);
			}

			var counter = 1;
			var fieldName;
			var fieldValue = '';
			const folderList = jetpack.list(`${config.folders.commands}`); // List contents of the cmds folder
			folderList.forEach(folder => {
				fieldName = `**${counter}.${folder}**`;
				counter++;
				const commandList = jetpack.list(`${config.folders.commands}/${folder}`); // Loop through the commands
				commandList.forEach(file => {
					cmdData = bot.commands.get(file.slice(0, -3)).data;
					if (cmdData) {
						const cmdExists = Commands.findOne({where: {
							guildId: msg.guild.id,
							name: args[0]
						}});
						if (cmdExists && cmdExists.enabled == false){

						} else {
							var command = file.slice(0, -3);
							cmdData = bot.commands.get(command).data;
							if (elevation >= cmdData.permissions) {
								fieldValue = fieldValue + `${file.slice(0, -3)}, `;
							}
						}
					}
				});
				fieldValue.slice(0, -2);
				await help.addField(fieldName,fieldValue);
				log.info(`${fieldName} ${fieldValue}`)
				fieldName = '';
				fieldValue = '';
			}); 
			await msg.channel.send({help}).catch(err => {
				log.error(`Could not output commands: ${err}.`);
			});
			log.verbose(`${msg.author.tag} has listed the available commands in #${msg.channel.name} on ${msg.guild.name}.`);
		}
	} catch (err) {
		log.error(`Error: ${err}.`);
	}
};
