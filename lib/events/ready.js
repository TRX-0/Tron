exports.func = async (client) => {
	const OTS = require(`${client.config.folders.models}/mute.js`);
	const loadCommands = require(`${client.config.folders.functions}/loadCommands.js`);
	const loadWatchers = require(`${client.config.folders.functions}/loadWatchers.js`);
	const log = require(`${client.config.folders.lib}/log.js`)('onReady');
	log.info(`Connected to Discord gateway & ${client.guilds.size} guilds.`);

	try {
		// Load commands and watchers in parallel
		[client.commands, client.watchers] = await Promise.all([loadCommands.func(client, log), loadWatchers.func(client, log)]);
		// Loop through connected guilds
		Array.from(client.guilds).forEach( async id => {
			// Attempt to find server with ID
			const server = await client.ServerModel.findOne({
				where: {
					guildId: id
				}
			});
			// Get guild object
			const guild = client.guilds.get(id);
			// If server is not known
			if (!server) {
				// Create a server object
				const server = await client.ServerModel.create({
					guildId: id,
					name: guild.name,
					permitChan: [],
					perm3: [],
					perm2: [],
					perm1: []
				});
				log.warn(`${guild.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			} else if (server.perm1 == "" || server.perm2 == "" || server.perm3 == "") {
				log.warn(`${guild.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			}


			// Set up Muted roles
			const OTSroles = await OTS.findOne({
				where: {
					guildId: id
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
				log.warn(`${guild.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			} else if (OTSroles.roleId == "" || OTSroles.mutedChannelId == "" || OTSroles.botspamChannelId == "") {
				log.warn(`${guild.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			}
			await client.createCommands.function(client, id, log);
		});
	} catch (err) {
		log.error(`Error on bot initialisation: ${err}`);
		bot.destroy();
		process.exit();
	}
}