const jetpack = require('fs-jetpack');
const chalk = require('chalk');

// Function to load commands into bot
module.exports.loadCmds = (Discord, bot, log) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cmds = new Discord.Collection();
			const loadedList = [];

			const folderList = jetpack.list(`${bot.config.folders.commands}`); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`${bot.config.folders.commands}/${folder}`); // Loop through the commands
					cmdList.forEach(file => {
						const props = require(`${bot.config.folders.commands}/${folder}/${file}`); // Load the command
						loadedList.push(props.data.name);
						cmds.set(props.data.command, props); // Store the command prototype in the cmds collection
						log.verbose(`Loaded Command: ${props.data.name}. 👌`);
					});
				} catch (err) {
					log.error(`Error in loadCmds: ${err}`);
					reject(err); // If there's an error, stop loading commands
				}
			});
			log.info(chalk.green(`Loaded ${loadedList.length} command(s) (${loadedList.join(', ')}).`));
			resolve(cmds); // Return the cmds collection
		} catch (err) {
			log.error(`Error in loadCmds: ${err}`);
			reject(err); // If there's an error, stop loading commands
		}
	});
};
