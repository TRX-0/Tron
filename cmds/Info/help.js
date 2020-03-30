exports.data = {
	name: 'Help',
	description: 'Lists available commands.',
	group: 'Info',
	command: 'help',
	syntax: 'help [optional:command]',
	author: 'TRX',
	permissions: 0,
};

const Discord = require('discord.js');

exports.func = async (message, args, client) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const elevation = require(`${client.config.folders.functions}/elevation.js`);
	try{
		const server = await client.ServerModel.findOne({where: {guildId: message.guild.id}});
		const level = await elevation.func(client, message);
		//Get all enabled commands for specific server
		const CommandsList = await client.CommandModel.findAll({
			where: {
				guildId: message.guild.id,
				enabled: true
			},
			raw: true
		});
		//Keep only the command names
		const EnabledCommands = await CommandsList.map( (command) => command.name);

		//Variable initialisation
		const specificCommand = args[0] || null;
		const help = new Discord.MessageEmbed({ color: 8418484});
		if (server.altPrefix) {
			help.setDescription(`*The prefix can be exchanged with \`@${client.user.tag} [command]\` or \`${server.altPrefix} [command]\`.*\n`);
		} else {
			help.setDescription(`*The prefix can be exchanged with \`@${client.user.tag} [command]\`*\n`);
		}

		//If help is requested for a specific command
		if (specificCommand) {
			//Check if command is loaded
			if (client.commands.has(specificCommand)) {
				const CommandData = await client.commands.get(specificCommand).data;
				//Check if command is enabled
				if(EnabledCommands.includes(CommandData.command)){
					//Check if user has permissions
					if (level >= CommandData.permissions){
						help.setTitle(`__Command: **${CommandData.name}**__`);
						help.addField('Description', CommandData.description, true);
						help.addField('Group', `${CommandData.group}`, true);
						help.addField('Syntax', `${client.config.prefix} ${CommandData.syntax}`);
						message.channel.send('', {embed: help});
						log.verbose(`${message.member.displayName} (${message.author.tag}) has requested additional info on !${specificCommand} in #${message.channel.name} on ${message.guild.name}.`);
					} else {
						return message.reply('You do not have permissions to view this command.');
					}
				} else {
					return message.reply('This command is disabled.');
				}
			} else {
				return message.reply('The specified command does not exist.');
			}
		//Else show all commands
		} else {
			help.setTitle(`__Commands in ${message.guild.name}.__`);
			let groups = {};
			//Get command groups
			await client.commands.forEach((cmd) => {
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
			message.channel.send('', { embed: help }).catch(err => {
				log.error(`Could not output commands: ${err}.`);
			});
			log.verbose(`${message.author.tag} has listed the available commands in #${message.channel.name} on ${message.guild.name}.`);
		}
	} catch (err) {
		log.error(`Something went wrong when trying to use the help command: ${err}`);
	}
};
