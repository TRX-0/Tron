exports.function = async (client, id) => {
	const log = require(`${client.config.folders.lib}/log.js`)('Create Commands');
	try {
		client.commands.forEach(async command => {
			const cmdExists = await client.CommandModel.findOne({
				where: {
					guildId: id,
					name: command.data.command
				}
			});
			if (!cmdExists) {
				await client.CommandModel.create({
					guildId: id,
					name: command.data.command,
					enabled: true
				});
				log.info(`Created db command entry for: ${command.data.command} in ${id}`);
			}
		});
	} catch (err) {
		log.error(`Error on command creation: ${err}`);
	}
};