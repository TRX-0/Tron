exports.data = {
	name: 'Enable',
	command: 'enable',
	description: 'Enables a command.',
	syntax: 'enable [command]',
	group: 'System',
	author: 'Aris A.',
	permissions: 4,
};

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0]){ // Check that user has provided arguments
			if (bot.commands.has(args[0])) { // Check if provided argument corresponds to an existing command
				//Check if command is registered in the database.
				const cmdExists = await bot.CMDModel.findOne({where: {
					guildId: msg.guild.id,
					name: args[0]
				}});
				//If it exists check if it is enabled in this guild.
				if (cmdExists){
					const isEnabled = (await bot.CMDModel.findOne({where: {
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
					await bot.CMDModel.create({
						guildId: msg.guild.id,
						name: args[0],
						enabled: true
					});
					log.info(`Created db entry for command ${args[0]}.`);
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
