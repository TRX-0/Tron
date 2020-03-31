exports.func = (client) => {
	const jetpack = require('fs-jetpack');
	const Discord = require('discord.js');
	const log = require(`${client.config.folders.lib}/log.js`)('Load Commands');
	return new Promise(async (resolve, reject) => {
		try {
			const cmds = new Discord.Collection();
			const loadedList = [];

			const folderList = jetpack.list(`${client.config.folders.commands}`); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`${client.config.folders.commands}/${folder}`); // Loop through the commands
					cmdList.forEach(file => {
						const props = require(`${client.config.folders.commands}/${folder}/${file}`); // Load the command
						loadedList.push(props.data.name);
						cmds.set(props.data.command, props); // Store the command prototype in the cmds collection
					});
				} catch (err) {
					log.error(`Error when loading commands: ${err}`);
					reject(err); // If there's an error, stop loading commands
				}
			});
			log.info(`Loaded ${loadedList.length} command(s) (${loadedList.join(', ')}).`);
			resolve(cmds); // Return the cmds collection
		} catch (err) {
			log.error(`Error in loadCmds: ${err}`);
			reject(err); // If there's an error, stop loading commands
		}
	});
};
