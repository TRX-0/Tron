exports.data = {
	name: 'Help',
	description: 'Lists available commands.',
	group: 'Info',
	command: 'help',
	syntax: 'help [optional:command]',
	author: 'Aris A.',
	permissions: 0,
};

const Discord = require('discord.js');

exports.func = async (msg, args, bot) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	const elevation = require(`${bot.config.folders.functions}/elevation.js`);
	try{
		const server = await bot.ServerModel.findOne({where: {guildId: msg.guild.id}});
		const level = await elevation.func(bot, msg);
		//Get all enabled commands for specific server
		const CommandsList = await bot.CommandModel.findAll({
			where: {
				guildId: msg.guild.id,
				enabled: true
			},
			raw: true
		});
		//Keep only the command names
		const EnabledCommands = await CommandsList.map( (command) => command.name);

		//Variable initialisation
		const specificCommand = args[0] || null;
		const help = new Discord.RichEmbed({ color: 8418484});
		if (server.altPrefix) {
			help.setDescription(`*The prefix can be exchanged with \`@${bot.user.tag} [command]\` or \`${server.altPrefix} [command]\`.*\n`);
		} else {
			help.setDescription(`*The prefix can be exchanged with \`@${bot.user.tag} [command]\`*\n`);
		}

		//If help is requested for a specific command
		if (specificCommand) {
			//Check if command is loaded
			if (bot.commands.has(specificCommand)) {
				const CommandData = await bot.commands.get(specificCommand).data;
				//Check if command is enabled
				if(EnabledCommands.includes(CommandData.command)){
					//Check if user has permissions
					if (level >= CommandData.permissions){
						help.setTitle(`__Command: **${CommandData.name}**__`);
						help.addField('Description', CommandData.description, true);
						help.addField('Group', `${CommandData.group}`, true);
						help.addField('Syntax', `${bot.config.prefix} ${CommandData.syntax}`);
						msg.channel.send('', {embed: help});
						log.verbose(`${msg.member.displayName} (${msg.author.tag}) has requested additional info on !${specificCommand} in #${msg.channel.name} on ${msg.guild.name}.`);
					} else {
						return msg.reply('You do not have permissions to view this command.');
					}
				} else {
					return msg.reply('This command is disabled.');
				}
			} else {
				return msg.reply('The specified command does not exist.');
			}
		//Else show all commands
		} else {
			help.setTitle(`__Commands in ${msg.guild.name}.__`);
			let groups = {};
			//Get command groups
			await bot.commands.forEach((cmd) => {
				if (!groups[cmd.data.group]){
					groups[cmd.data.group] = [];
				} 
				groups[cmd.data.group].push(cmd);
			});
			//For each group add the appropriate commands
			await Object.keys(groups).forEach((group) => {
				let fieldValue = '';
				const fieldName = `**${group}**`;
				fieldValue = groups[group].reduce((accumulator, cmd) => {
					if (EnabledCommands.includes(cmd.data.command) && (level >= cmd.data.permissions)) {
						accumulator.push(cmd.data.command);
					}
					return accumulator;
				}, []).join(', ');
				if(fieldValue != ''){
					help.addField(`${fieldName}`,`\`${fieldValue}\``);
				}
			});
			msg.channel.send(help).catch(err => {
				log.error(`Could not output commands: ${err}.`);
			});
			log.verbose(`${msg.author.tag} has listed the available commands in #${msg.channel.name} on ${msg.guild.name}.`);
		}
	} catch (err) {
		log.error(`Something went wrong when trying to use the help command: ${err}`);
	}
};
