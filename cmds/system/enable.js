exports.data = {
	name: 'Enable Command',
	command: 'enable',
	description: 'Enables a new/disabled command.',
	syntax: 'enable [command]',
	group: 'system',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

const log = require('../../lib/log.js')(exports.data.name);
const Commands = require('../../lib/commands');

exports.func = async (msg, args, bot) => {
	try {
		if (args[0]){ // Check that user has provided arguments
			if (bot.commands.has(args[0])) { // Check if provided argument corresponds to an existing command
				//Check if command is registered in the database.
				const cmdExists = await Commands.findOne({where: {
					guildId: msg.guild.id,
					name: args[0]
				}});
				//If it exists check if it is enabled in this guild.
				if (cmdExists){
					const isEnabled = (await Commands.findOne({where: {
						guildId: msg.guild.id,
						name: args[0]
					}})).enabled;
					if (!isEnabled){
						const m = await msg.channel.send(`Enabling: ${args[0]}`);
						await cmdExists.update({
							enabled: true
						});
						await m.edit(`Successfully enabled: ${args[0]}`);
						log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has enabled ${args[0]} on ${msg.guild.name}.`);
					} else {
						//If it is enabled return.
						msg.reply(`Command "${args[0]}" is already enabled in ${msg.guild.name}.`);
						return;
					}
				} else {
					//If command does not exist in db, create it.
					const createCommand = await Commands.create({
						guildId: msg.guild.id,
						name: args[0],
						enabled: true
					});
					log.info(`Created db entry for command ${command}.`);
				}
			} else {
				msg.reply('Specified command does not exist.');
			}
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
