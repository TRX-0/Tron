exports.func = async (bot, guild) => {
	const OTS = require(`${bot.config.folders.models}/mute.js`);
	const Server = require(`${bot.config.folders.models}/server.js`);
	const log = require(`${bot.config.folders.lib}/log.js`)('Core');

	try {
		log.info(`Joined ${guild.name}.`);
		// Attempt to find server with ID
		const server = await bot.Server.findOne({ 
			where: {
				guildId: guild.id
			}
		});
		// If server is not known
		if (!server) { 
			// Create a server object
			const server = await Server.create({ 
				guildId: guild.id,
				name: guild.name,
				permitChan: [],
				perm3: [],
				perm2: [],
				perm1: []
			});
			// Emit a warning
			log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			const OTSroles = await OTS.findOne({
				where: {
					guildId: guild.id
				}
			});
			if (!OTSroles) {
				//Creates OTS entry
				await OTS.create({
					guildId: id,
					roleId: "",
					mutedChannelId: "",
					botspamChannelId: ""
				});
				log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			}
			await createCommands(bot, guild, guild.id);
		}
	} catch (err) {
		log.error(`Error on joining a new server: ${err}`);
	}
}

//Function that creates commands in the db.
async function createCommands (bot, guild, id){
	CMDModel = require(`${bot.config.folders.models}/commands.js`);
	bot.commands.forEach(async command => {
		const cmdExists = await CMDModel.findOne({
			where:{
				guildId: id,
				name: command.data.command
			}
		});
		if (!cmdExists){
			await CMDModel.create({
				guildId: id,
				name: command.data.command,
				enabled: true
			});
			log.info(`Created db command entry for: ${command.data.command} in ${guild.name}`);
		}
	});
};