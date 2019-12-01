exports.function = async (bot, id, log) => {
	//Function that creates commands in the db.
	bot.commands.forEach(async command => {
		const cmdExists = await bot.CommandModel.findOne({
			where: {
				guildId: id,
				name: command.data.command
			}
		});
		if (!cmdExists) {
			await bot.CommandModel.create({
				guildId: id,
				name: command.data.command,
				enabled: true
			});
			log.info(`Created db command entry for: ${command.data.command} in ${guild.name}`);
		}
	});
};