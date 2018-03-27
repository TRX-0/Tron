const jetpack = require('fs-jetpack');
const chalk = require('chalk');

// Function to load watchers into bot
exports.func = (Discord, bot, log) => {
	return new Promise(async (resolve, reject) => {
		try {
			
			const watcherList = jetpack.list(`${bot.config.folders.watchers}`); // List contents of the watchers folder
			const loadedList = [];
			const skippedList = [];
			await bot.Watcher.sync(); // Create the watchers table if it does not exist
			await Promise.all(watcherList.map(f => { // Load watchers in parallel
				return new Promise(async (resolve, reject) => {
					try {
						const props = require(`${bot.config.folders.watchers}/${f}`); // Load watcher module
						let watcher = await bot.Watcher.findOne({where: {watcherName: props.data.command}}); // Search for loaded watcher in the watchers table
						if (!watcher) { // If it doesn't exist, create it, assuming it is enabled and disabled in no guilds
							watcher = await bot.Watcher.create({
								watcherName: props.data.command,
								globalEnable: true,
								disabledGuilds: []
							});
						}
						if (watcher.globalEnable) { // Load the watcher if it is globally enabled
							log.verbose(`Loading Watcher: ${props.data.name}. 👌`);
							loadedList.push(props.data.name);
							bot.watchers.set(props.data.command, props); // Store the command prototype in the watchers collection
							props.watcher(bot); // Wait for setup of watcher
							resolve(true); // Return true as the watcher has loaded successfully
						} else {
							log.verbose(`Skipped loading ${props.data.name} as it is disabled. ❌`);
							skippedList.push(props.data.name);
							resolve(false); // Return false as the watcher is disabled
						}
					} catch (err) {
						reject(err); // Return the error (this will cause a rejection of the loading of all watchers)
					}
				});
			}));
			log.info(chalk.green(`Loaded ${loadedList.length} watcher(s) (${loadedList.join(', ')}) and skipped ${skippedList.length} (${skippedList.join(', ')}).`));
			resolve(bot.watchers); // Return the watchers collection
		} catch (err) {
			log.error(`Error in loadWatchers: ${err}`);
			reject(err); // If there's an error, stop loading commands
		}
	});
};