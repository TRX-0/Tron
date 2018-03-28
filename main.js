// Initialize Discord Bot
var Discord = require('discord.js');
const bot = new Discord.Client();
bot.config = require('./config.json');
bot.auth = require('./auth.json');
bot.watchers = new Discord.Collection();

// Basic Function Modules
const log = require(`${bot.config.folders.lib}/log.js`)('Core');
bot.Watcher = require(`${bot.config.folders.models}/watcher.js`);
const chalk = require('chalk');
const loadCmds = require(`${bot.config.folders.lib}/loadCommands.js`);
const loadWatchers = require(`${bot.config.folders.lib}/loadWatchers.js`);
const exec = require('util').promisify(require('child_process').exec);

// Database modules
const Database = require(`${bot.config.folders.lib}/db.js`);
bot.Server = require(`${bot.config.folders.models}/server.js`);
bot.CMDModel = require(`${bot.config.folders.models}/commands.js`);
const Profiles = require(`${bot.config.folders.models}/profiles.js`);
const OTS = require(`${bot.config.folders.models}/mute.js`);

// ==== Initialisation ====
bot.db = Database.start(); // Start the database and connect

// ==== Event Handlers ==== //

// On bot connection to Discord
bot.on('ready', async () => {
	try {
		log.info(chalk.green(`Connected to Discord gateway & ${bot.guilds.size} guilds.`));
		[bot.commands, bot.watchers] = await Promise.all([loadCmds.func(Discord, bot, log), loadWatchers.func(Discord, bot, log)]); // Load commands and watchers in parallel
		bot.guilds.keyArray().forEach(async id => { // Loop through connected guilds
			const guild = bot.guilds.get(id); // Get guild object
			await bot.Server.sync(); // Create server table if it does not exist
			const server = await bot.Server.findOne({ // Attempt to find server with ID
				where: {
					guildId: id
				}
			});
			if (!server) { // If server is not known
				const server = await bot.Server.create({ // Create a server object (this is required for basic bot operation)
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
			const OTSroles = await OTS.findOne({
				where: {
					guildId: id
				}
			});
			if (!OTSroles){
				//Creates OTS entry
				/*await OTS.create({
					guildId: id,
					roleId: []
				});*/
				log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			}
			await bot.createCommands(guild, id);
		});
	} catch (err) {
		log.error(`Error in bot initialisation: ${err}`);
	}
});

// When message is received
bot.on('message', msg => {
	try {
		//var timer = process.hrtime();
		// Reject message if the message author is a bot or the message is not in a guild (eg. DMs)
		if (msg.author.bot || !msg.guild) return;
		// Find message's guild in the database
		bot.Server.findOne({ 
			where: {
				guildId: msg.guild.id
			}
		}).then( (msgserver) => {
			let command, args;
			// Loop through possible prefixes to check if message is a command - this is a bit confusing because if the message is a command, then it is set to false (this is just so I could use .every())
			const notCommand = [msgserver.altPrefix, bot.config.prefix, `<@${bot.user.id}>`, `<@!${bot.user.id}>`].every(prefix => {
				if (msg.content.toLowerCase().startsWith(prefix)) { // Check if message starts with prefix
					command = msg.content.slice(prefix.length).trim().split(' ')[0]; // Get the name of the command
					args = msg.content.slice(prefix.length).trim().split(' ').slice(1); // Get the args of the command
					return false;
				}
				return true;
			});
			if (notCommand) {
				updateUser(msg).then( () => {
					return;
				});
				return;
			}
	
			let cmd;
			// Check whether command exists as a file. (loaded in the commands collection)
			if (bot.commands.has(command)) { 
				// Fetch the command's prototype
				cmd = bot.commands.get(command); 
			} else {
				return msg.reply('Command does not exist.');
			}
			//Check if command is registered in the database.
			bot.CMDModel.findOne({
				where: {
					guildId: msg.guild.id,
					name: command
				}
			}).then((cmdExists) => {
				//If it is disabled return.
				if (cmdExists && cmdExists.enabled == false){
					msg.reply(`Command is disabled in ${msg.guild.name}.`);
					return;
				}
				// Sometimes a message doesn't have a member object attached (idk either like wtf)
				if (!msg.member) { 
					msg.member = msg.guild.fetchMember(msg);
				}
				// Get user's permission level
				bot.elevation(msg).then( (msgelevation) => {
					if (msgelevation >= cmd.data.permissions) { // Check that the user exceeds the command's required elevation
						cmd.func(msg, args, bot); // Run the command's function
					} else {
						msg.reply(':scream: You don\'t have permission to use this command.');
					}
				});
			});
		});
		//log.info(`${process.hrtime(timer)[0]}s, ${(process.hrtime(timer)[1] / 1000000).toFixed(3)}ms`);
	} catch (err) {
		log.error(`Something went wrong when handling a message: ${err}`);
	}
});

// On the bot joining a server
bot.on('guildCreate', async guild => {
	try{
		log.info(`Joined ${guild.name}.`);
		const server = await bot.Server.findOne({ // Attempt to find server with ID
			where: {
				guildId: guild.id
			}
		});
		if (!server) { // If server is not known
			const server = await bot.Server.create({ // Create a server object (this is required for basic bot operation)
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
			if (!OTSroles){
				//Creates OTS entry
				/*await OTS.create({
					guildId: id,
					roleId: []
				});*/
				log.warn(`${server.name} OTS roles have not been set up properly. Make sure to set them up to enable all functionality.`);
			}
			await bot.createCommands(guild, guild.id);
		}
	} catch (err) {
		log.error(`Error on joining a new server: ${err}`);
	}
});

// Officially start the bot
bot.login(bot.auth.token);

bot.on('error', log.error); // If there's an error, emit an error to the logger
bot.on('warn', log.warn); // If there's a warning, emit a warning to the logger

process.on('unhandledRejection', err => { // If I've forgotten to catch a promise somewhere, emit an error
	log.error(`Uncaught Promise Error: \n${err.stack}`);
});


// ==== Global Helper Functions ====

//Function that creates commands in the db.
bot.createCommands = (guild, id) => {
	bot.commands.forEach(async command => {
		const cmdExists = await bot.CMDModel.findOne({
			where:{
				guildId: id,
				name: command.data.command
			}
		});
		if (!cmdExists){
			await bot.CMDModel.create({
				guildId: id,
				name: command.data.command,
				enabled: true
			});
			log.info(`Created db command entry for: ${command.data.command} in ${guild.name}`);
		}
	});
};

// ====On message event functions ====
async function updateUser (msg){
	//Check if user exists in db
	const userExists = await Profiles.findOne({
		where: {
			guildId: msg.guild.id,
			username: msg.author.username
		}
	});
	//If user exists
	if (userExists){
		//Get message count and add one more
		var UserCount = userExists.msgcount + 1;
		await userExists.update({
			msgcount: UserCount
		});
	} else {
		//Else create user entry in db
		await Profiles.create({
			guildId: msg.guild.id,
			username: msg.author.username,
			discordid: msg.author.id
		});
		log.info(`Created db entry for user ${msg.author.username}.`);
	}
	return;
}
// =====================================================

//Function that stops bot
bot.stop = (msg) => {
	return new Promise((resolve, reject) => {
		try {
			if(bot.config.pm2 == 'true'){
				msg.channel.send('Stopping all processes and exiting!');
				exec('pm2 stop Tron');
			} else if (bot.config.pm2 == 'false') {
				msg.channel.send('Stopping all processes and exiting!');
				bot.destroy();
				process.exit();
			} else {
				msg.reply('Incorect configuration. Value PM2 not set correctly!');
			}
		} catch (err) {
			log.error(`Error on bot quit: ${err}`);
			reject(err);
		}
	});
};

//Function that restarts bot
bot.restart = (msg) => {
	return new Promise((resolve, reject) => {
		try {
			if(bot.config.pm2 == 'true'){
				msg.channel.send('Restarting all processes!');
				exec('pm2 restart Tron');
			} else if (bot.config.pm2 == 'false') {
				msg.channel.send('Restarting all processes!');
				exec(`cd ${bot.config.folders.home} && node main.js`);
				bot.destroy();
				process.exit();
			} else {
				msg.reply('Incorect configuration. Value PM2 not set correctly!');
			}
		} catch (err) {
			log.error(`Error on bot quit: ${err}`);
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
			const watchProps = require(`${bot.config.folders.watchers}/${watcher}.js`); // Loads watcher
			bot.watchers.set(watcher, watchProps); // Add to bot's collection of watchers
			bot.watchers.get(watcher).watcher(bot); // Initialise watcher
			await watcherData.update({globalEnable: true}); // Set watcher to enabled in database
			resolve();
		} catch (err) {
			log.error(`Error when enabling a watcher: ${err}`);
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
			delete require.cache[require.resolve(`${bot.config.folders.watchers}/${watcher}.js`)]; // Delete watcher from cache
			bot.watchers.delete(watcher); // Delete from bot's collection of watchers
			resolve();
		} catch (err) {
			log.error(`Error when disabling a watcher: ${err}`);
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
			delete require.cache[require.resolve(`${bot.config.folders.watchers}/${watcher}.js`)]; // Delete watcher from cache
			bot.watchers.delete(watcher); // Delete from bot's collection of watchers
			const watchProps = require(`${bot.config.folders.watchers}/${watcher}.js`); // Loads watcher
			bot.watchers.set(watcher, watchProps); // Add to bot's collection of watchers
			bot.watchers.get(watcher).watcher(bot); // Initialise watcher
			resolve();
		} catch (err) {
			log.error(`Error when reloading a watcher: ${err}`);
			reject(err);
		}
	});
};

bot.schedule = (msg, time) => {
	var schedule = require('node-schedule');
	schedule.scheduleJob(time, function(/*fireDate*/){
		const time = new Discord.Collection();
		//msg.channel.send('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
		time.set(msg);
		time.edit(`Current time is: \`\`\`${new Date()}\`\`\` or \`\`\`${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}\`\`\` `);
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
			if (impUser.id === bot.auth.ownerID) { // If the author's ID is the same as the bot owner's then give them top perms
				resolve(4);
			}
			const server = await bot.Server.findOne({ // Fetch server object
				where: {
					guildId: msg.guild.id
				}
			});
			/*if (impMember.hasPermission('ADMINISTRATOR')) { // If user is an admin in the server
				resolve(3);
			}*/
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
			log.error(`Error on message evelvation: ${err}`);
			reject(err);
		}
	});
};