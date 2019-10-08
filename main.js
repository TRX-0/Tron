// Initialize Discord Bot
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.config = require('./config.json');
bot.auth = require('./auth.json');
bot.watchers = new Discord.Collection();

// Basic Function Modules
const log = require(`${bot.config.folders.lib}/log.js`)('Core');
bot.Watcher = require(`${bot.config.folders.models}/watcher.js`);

// Event Handlers
bot.onMessage = require(`${bot.config.folders.events}/message.js`);
bot.onReady = require(`${bot.config.folders.events}/ready.js`);
bot.onGuildCreate = require(`${bot.config.folders.events}/guildCreate.js`);

// Database modules
const Database = require(`${bot.config.folders.lib}/db.js`);
bot.db = Database.start(); // Start the database and connect
bot.CommandModel = require(`${bot.config.folders.models}/commands.js`);
bot.ServerModel = require(`${bot.config.folders.models}/server.js`);
bot.MuteModel = require(`${bot.config.folders.models}/mute.js`);
bot.ProfilesModel = require(`${bot.config.folders.models}/profiles.js`);


// =====Event Handlers=====

// On bot connection to Discord
bot.on('ready', () => {
	bot.onReady.func(bot);
});

// When message is received
bot.on('message', msg => {
	bot.onMessage.func(bot, msg);
});

// On member join
bot.on('guildMemberAdd', member => {
    //member.guild.channels.get('channelID').send("Welcome"); 
});

// On the bot joining a server
bot.on('guildCreate', async guild => {
	bot.onGuildCreate.func(bot, guild);
});


// Start the bot
bot.login(bot.auth.token);
bot.on('error', log.error); // If there's an error, emit an error to the logger
bot.on('warn', log.warn); // If there's a warning, emit a warning to the logger

process.on('unhandledRejection', err => { // If I've forgotten to catch a promise somewhere, emit an error
	log.error(`Uncaught Promise Error: \n${err.stack}`);
});




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