exports.data = {
	name: 'Disable',
	command: 'disable',
	description: 'Disables a command.',
	group: 'System',
	syntax: 'disable [command]',
	author: 'TRX',
	permissions: 4,
};

exports.func = async (message, args, client) => {
	const log = require(`${client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0]){ // Check that user has provided arguments
			if (client.commands.has(args[0])) { // Check if provided argument corresponds to an existing command
				//Check if command is registered in the database.
				const cmdExists = await client.CommandModel.findOne({where: {
					guildId: message.guild.id,
					name: args[0]
				}});
				//If it exists check if it is enabled in this guild.
				if (cmdExists){
					const isEnabled = (await client.CommandModel.findOne({where: {
						guildId: message.guild.id,
						name: args[0]
					}})).enabled;
					if (isEnabled){
						const m = await message.channel.send(`Disabling: ${args[0]}`);
						await cmdExists.update({
							enabled: false
						});
						await m.edit(`Successfully disabled: ${args[0]}`);
						log.info(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) has disabled ${args[0]} on ${message.guild.name}.`);
					} else {
						//If it is disabled return.
						message.reply(`Command "${args[0]}" is already disabled in ${message.guild.name}.`);
						return;
					}
				} else {
					//If command does not exist in db, create it.
					await client.CommandModel.create({
						guildId: message.guild.id,
						name: args[0],
						enabled: true
					});
					log.info(`Created db entry for command ${args[0]}.`);
				}
			} else {
				message.reply('Specified command does not exist.');
			}
		} else {
			message.reply('You did not provide any arguments.');
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Something went wrong: ${err}`);
	}
};
