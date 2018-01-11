var Discord = require('discord.js');
const log = require('./lib/log')('Core');
const jetpack = require('fs-jetpack');
const chalk = require('chalk');
const Watcher = require('./lib/models/watcher');

// Initialize Discord Bot
const bot = new Discord.Client();
bot.config = require('./config.json');

// Database modules
const Database = require('./lib/db');
const Server = require('./lib/models/server');

// ==== Initialisation ====
bot.db = Database.start(); // Start the database and connect

// Function to load commands into bot
bot.loadCmds = () => {
	return new Promise((resolve, reject) => {
		try {
			const cmds = new Discord.Collection();
			const loadedList = [];

			const folderList = jetpack.list('./cmds/'); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`./cmds/${folder}`); // Loop through the commands
					cmdList.forEach(file => {
						const props = require(`./cmds/${folder}/${file}`); // Load the command
						log.verbose(`Loading Command: ${props.data.name}. 👌`);
						loadedList.push(props.data.name);
						cmds.set(props.data.command, props); // Store the command prototype in the cmds collection
					});
				} catch (err) {
					reject(err); // If there's an error, stop loading commands
				}
			});
			log.info(chalk.green(`Loaded ${loadedList.length} command(s) (${loadedList.join(', ')}).`));
			resolve(cmds); // Return the cmds collection
		} catch (err) {
			reject(err); // If there's an error, stop loading commands
		}
	});
};

// Function to load watchers into bot
bot.loadWatchers = bot => {
	return new Promise(async (resolve, reject) => {
		try {
			const watchers = new Discord.Collection();
			const watcherList = jetpack.list('./watchers/'); // List contents of the watchers folder
			const loadedList = [];
			const skippedList = [];
			await Watcher.sync(); // Create the watchers table if it does not exist
			await Promise.all(watcherList.map(f => { // Load watchers in parallel
				return new Promise(async (resolve, reject) => {
					try {
						const props = require(`./watchers/${f}`); // Load watcher module
						let watcher = await Watcher.findOne({where: {watcherName: props.data.command}}); // Search for loaded watcher in the watchers table
						if (!watcher) { // If it doesn't exist, create it, assuming it is enabled and disabled in no guilds
							watcher = await Watcher.create({
								watcherName: props.data.command,
								globalEnable: true,
								disabledGuilds: []
							});
						}
						if (watcher.globalEnable) { // Load the watcher if it is globally enabled
							log.verbose(`Loading Watcher: ${props.data.name}. 👌`);
							loadedList.push(props.data.name);
							watchers.set(props.data.command, props); // Store the command prototype in the watchers collection
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
			resolve(watchers); // Return the watchers collection
		} catch (err) {
			reject(err); // If there's an error, stop loading commands
		}
	});
};


// ==== Event Handlers ====

// On bot connection to Discord
bot.on('ready', async () => {
	try {
		log.info(chalk.green(`Connected to Discord gateway & ${bot.guilds.size} guilds.`));
		[bot.commands, bot.watchers] = await Promise.all([bot.loadCmds(bot), bot.loadWatchers(bot)]); // Load commands and watchers in parallel
		bot.guilds.keyArray().forEach(async id => { // Loop through connected guilds
			const guild = bot.guilds.get(id); // Get guild object
			await Server.sync(); // Create server table if it does not exist
			const server = await Server.findOne({ // Attempt to find server with ID
				where: {
					guildId: id
				}
			});
			if (server) { // If server is known
				
			} else {
				const server = await Server.create({ // Create a server object (this is required for basic bot operation)
					guildId: id,
					name: guild.name,
					permitChan: [],
					perm3: [],
					perm2: [],
					perm1: []
				});
				// Emit a warning
				log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
			}
});
	} catch (err) {
		log.error(`Error in bot initialisation: ${err}`);
	}
});

// When message is received
bot.on('message', async msg => {
	try {
		if (msg.author.bot || !msg.guild) { // Reject message if the message author is a bot or the message is not in a guild (eg. DMs)
			return;
		}

		msg.server = await Server.findOne({ // Find message's guild in the database
			where: {
				guildId: msg.guild.id
			}
		});

		let command;
		let args;
		let emotes;
		let quotelist;

		// Loop through possible prefixes to check if message is a command - this is a bit confusing because if the message is a command, then it is set to false (this is just so I could use .every())
		const notCommand = [msg.server.altPrefix, bot.config.prefix, `<@${bot.user.id}>`, `<@!${bot.user.id}>`].every(prefix => {
			if (msg.content.toLowerCase().startsWith(prefix)) { // Check if message starts with prefix
				command = msg.content.slice(prefix.length).trim().split(' ')[0]; // Get the name of the command
				args = msg.content.slice(prefix.length).trim().split(' ').slice(1); // Get the args of the command
				return false;
			}
			return true;
		});
		if (notCommand) { // If it's not a command, reject it
			return;
		}

		let cmd;
		if (!msg.member) { // Sometimes a message doesn't have a member object attached (idk either like wtf)
			msg.member = await msg.guild.fetchMember(msg);
		}

		msg.elevation = await bot.elevation(msg); // Get user's permission level

		if (bot.commands.has(command)) { // Check whether command exists
			cmd = bot.commands.get(command); // Fetch the command's prototype
		} else {
			msg.reply('Command does not exist.');
		}
		if (cmd && (cmd.data.anywhere || msg.elevation >= 3 || msg.server.permitChan.includes(msg.channel.id))) { // Command is flagged to be used anywhere/user has 3+ elevation level/is in a permitted channel
			if (msg.elevation >= cmd.data.permissions) { // Check that the user exceeds the command's required elevation
				cmd.func(msg, args, bot); // Run the command's function
			} else {
				msg.reply(':newspaper2: You don\'t have permission to use this command.');
			}
		}
	} catch (err) {
		log.error(`Something went wrong when handling a message: ${err}`);
	}
});

// On the bot joining a server
bot.on('guildCreate', async guild => {
	log.info(`Joined ${guild.name}.`);
	const server = await Server.findOne({ // Attempt to find server with ID
		where: {
			guildId: guild.id
		}
	});
	if (server) { // If server is known

	} else {
		const server = await Server.create({ // Create a server object (this is required for basic bot operation)
			guildId: guild.id,
			name: guild.name,
			permitChan: [],
			perm3: [],
			perm2: [],
			perm1: []
		});
		// Emit a warning
		log.warn(`${server.name} has not been set up properly. Make sure it is set up correctly to enable all functionality.`);
	}
});


bot.on('error', log.error); // If there's an error, emit an error to the logger
bot.on('warn', log.warn); // If there's a warning, emit a warning to the logger

process.on('unhandledRejection', err => { // If I've forgotten to catch a promise somewhere, emit an error
	log.error(`Uncaught Promise Error: \n${err.stack}`);
});

// Officially start the bot
bot.login(bot.config.token);





// ==== Global Helper Functions ====

/**
 * Reloads a specified command
 *
 * @param {string} command - Name of the command to be reloaded
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.reload = command => {
	return new Promise((resolve, reject) => {
		try {
			const folderList = jetpack.list('./cmds/'); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`./cmds/${folder}/`); // Loop through the files
					cmdList.forEach(file => {
						if (`${file}` == `${command}.js`){
							delete require.cache[require.resolve(`./cmds/${folder}/${command}.js`)]; // Delete command from cache
							const cmd = require(`./cmds/${folder}/${command}.js`); // Load command
							bot.commands.delete(command);
							bot.commands.set(command, cmd); // Re-add to the bot's collection of commands
							reloaded = true;
							resolve();
						}
					});	
				} catch (err) {
					reject(err);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};	

/**
 * Enables a specified command
 *
 * @param {string} command - Name of the command to be enabled
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.enable = command => {
	return new Promise((resolve, reject) => {
		try {
			const folderList = jetpack.list('./cmds/'); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`./cmds/${folder}/`); // Loop through the commands
					cmdList.forEach(file => {
						if (`${file}` == `${command}.js`){
							const cmd = require(`./cmds/${folder}/${command}.js`); // Load command
							bot.commands.set(command, cmd); // Add to bot's collection of commands
							resolve();
						}
					});	
				} catch (err) {
					reject(err);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Disables a specified command
 *
 * @param {string} command - Name of the command to be disabled
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.disable = command => {
	return new Promise((resolve, reject) => {
		try {
			const folderList = jetpack.list('./cmds/'); // List contents of the cmds folder
			folderList.forEach(folder => { // Loop through the folders
				try {
					const cmdList = jetpack.list(`./cmds/${folder}/`); // Loop through the commands
					cmdList.forEach(file => {
						if (`${file}` == `${command}.js`){
							delete require.cache[require.resolve(`./cmds/${folder}/${command}.js`)]; // Delete command from cache
							bot.commands.delete(command); // Delete from bot's collection of commands
							resolve();
						}
					});	
				} catch (err) {
					reject(err);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
};


/**
 * Enables a specified watcher
 *
 * @param {string} watcher - Name of the watcher to be enabled
 * @param {Watcher} watcherData - Watcher's instance in database
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.watcherEnable = (watcher, watcherData) => {
	return new Promise(async (resolve, reject) => {
		try {
			const watchProps = require(`./watchers/${watcher}.js`); // Loads watcher
			bot.watchers.set(watcher, watchProps); // Add to bot's collection of watchers
			bot.watchers.get(watcher).watcher(bot); // Initialise watcher
			await watcherData.update({globalEnable: true}); // Set watcher to enabled in database
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Disables a specified watcher
 *
 * @param {string} watcher - Name of the watcher to be disabled
 * @param {Watcher} watcherData - Watcher's instance in database
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.watcherDisable = (watcher, watcherData) => {
	return new Promise(async (resolve, reject) => {
		try {
			bot.watchers.get(watcher).disable(); // Disable watcher's function
			await watcherData.update({globalEnable: false}); // Set watcher to disabled in database
			delete require.cache[require.resolve(`./watchers/${watcher}.js`)]; // Delete watcher from cache
			bot.watchers.delete(watcher); // Delete from bot's collection of watchers
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Reloads a specified watcher
 *
 * @param {string} watcher - Name of the watcher to be reloaded
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.watcherReload = watcher => {
	return new Promise((resolve, reject) => {
		try {
			bot.watchers.get(watcher).disable(); // Disable watcher's function
			delete require.cache[require.resolve(`./watchers/${watcher}.js`)]; // Delete watcher from cache
			bot.watchers.delete(watcher); // Delete from bot's collection of watchers
			const watchProps = require(`./watchers/${watcher}.js`); // Loads watcher
			bot.watchers.set(watcher, watchProps); // Add to bot's collection of watchers
			bot.watchers.get(watcher).watcher(bot); // Initialise watcher
			resolve();
		} catch (err) {
			reject(err);
		}
	});
};

/**
 * Gets elevation of user from message
 *
 * @param {Message} msg - Message object
 * @param {User} [user] - User object
 * @returns {Promise} Resolves with nothing, rejects with Error object
 */
bot.elevation = (msg, user) => {
	return new Promise(async (resolve, reject) => {
		try {
			const impUser = user || msg.author; // If there is a user object, this is the user we care about, otherwise, just message author
			const impMember = user ? await msg.guild.fetchMember(user.id) : msg.member; // If we care about the user object, we have no member object - fetch it
			if (impUser.id === bot.config.ownerID) { // If the author's ID is the same as the bot owner's then give them top perms
				resolve(4);
			}
			const server = await Server.findOne({ // Fetch server object
				where: {
					guildId: msg.guild.id
				}
			});
			if (impMember.hasPermission('ADMINISTRATOR')) { // If user is an admin in the server
				resolve(3);
			}
			server.perm3.forEach(id => { // Loop through level 3 permissions for the server, check user against them
				if (impMember.roles.has(id)) {
					resolve(3);
				}
			});
			server.perm2.forEach(id => { // Loop through level 2 permissions for the server, check user against them
				if (impMember.roles.has(id)) {
					resolve(2);
				}
			});
			server.perm1.forEach(id => { // Loop through level 1 permissions for the server, check user against them
				if (impMember.roles.has(id)) {
					resolve(1);
				}
			});
			resolve(0); // Otherwise nothing
		} catch (err) {
			reject(err);
		}
	});
};