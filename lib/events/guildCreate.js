exports.func = async (client, guild) => {
	const log = require(`${client.config.folders.lib}/log.js`)('onGuildCreate');
	try {
		log.info(`Joined ${guild.name}.`);
		// Attempt to find server with ID
		const server = await client.ServerModel.findOne({ 
			where: {
				guildId: guild.id
			}
		});
		// If server is not known
		if (!server) { 
			// Create a server object
			const server = await client.ServerModel.create({ 
				guildId: guild.id,
				name: guild.name,
				permitChan: [],
				perm3: [],
				perm2: [],
				perm1: []
			});
			// Emit a warning
			log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			const OTSroles = await client.MuteModel.findOne({
				where: {
					guildId: guild.id
				}
			});
			if (!OTSroles) {
				//Creates OTS entry
				await client.MuteModel.create({
					guildId: id,
					roleId: "",
					mutedChannelId: "",
					botspamChannelId: ""
				});
				log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			}
		}
		await client.createCommands.function(client, guild, guild.id, log);
	} catch (err) {
		log.error(`Error on joining a new server: ${err}`);
	}
}