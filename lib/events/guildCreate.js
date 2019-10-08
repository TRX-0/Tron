exports.func = async (bot, guild) => {
	try {
		bot.log.info(`Joined ${guild.name}.`);
		// Attempt to find server with ID
		const server = await bot.ServerModel.findOne({ 
			where: {
				guildId: guild.id
			}
		});
		// If server is not known
		if (!server) { 
			// Create a server object
			const server = await bot.ServerModel.create({ 
				guildId: guild.id,
				name: guild.name,
				permitChan: [],
				perm3: [],
				perm2: [],
				perm1: []
			});
			// Emit a warning
			bot.log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			const OTSroles = await bot.MuteModel.findOne({
				where: {
					guildId: guild.id
				}
			});
			if (!OTSroles) {
				//Creates OTS entry
				await bot.MuteModel.create({
					guildId: id,
					roleId: "",
					mutedChannelId: "",
					botspamChannelId: ""
				});
				bot.log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			}
			await createCommands(bot, guild, guild.id);
		}
	} catch (err) {
		bot.log.error(`Error on joining a new server: ${err}`);
	}
}

//Function that creates commands in the db.
async function createCommands (bot, guild, id){
	bot.commands.forEach(async command => {
		const cmdExists = await bot.CommandModel.findOne({
			where:{
				guildId: id,
				name: command.data.command
			}
		});
		if (!cmdExists){
			await bot.CommandModel.create({
				guildId: id,
				name: command.data.command,
				enabled: true
			});
			bot.log.info(`Created db command entry for: ${command.data.command} in ${guild.name}`);
		}
	});
};