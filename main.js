// Initialize Discord client
const Discord = require('discord.js');

//const botIntents = new IntentsBitField();
//botIntents.add(IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers);

const client = new Discord.Client({
	intents: [
		"Guilds",
		"GuildMessages",
		"GuildMembers",
		"GuildBans",
		"GuildEmojisAndStickers",
		"GuildIntegrations",
		"GuildWebhooks",
		"GuildInvites",
		"GuildVoiceStates",
		"GuildPresences",
		"GuildMessageReactions",
		"GuildMessageTyping",
		"DirectMessages"
	]
});
client.config = require('./config.json');
client.auth = require('./auth.json');
client.watchers = new Discord.Collection();

// Basic Function Modules
const log = require(`${client.config.folders.lib}/log.js`)('Core');
client.createCommands = require(`${client.config.folders.functions}/createCommands.js`);
client.findUser = require(`${client.config.folders.functions}/findUser.js`);

// Music modules
client.queue = new Map();


// Event Handlers
client.onMessage = require(`${client.config.folders.events}/message.js`);
client.onReady = require(`${client.config.folders.events}/ready.js`);
client.onGuildCreate = require(`${client.config.folders.events}/guildCreate.js`);

// Database modules
const Database = require(`${client.config.folders.lib}/db.js`);
client.db = Database.start(); // Start the database and connect
client.CommandModel = require(`${client.config.folders.models}/commands.js`);
client.CountdownModel = require(`${client.config.folders.models}/countdown.js`);
client.MuteModel = require(`${client.config.folders.models}/mute.js`);
client.ProfilesModel = require(`${client.config.folders.models}/profiles.js`);
client.ServerModel = require(`${client.config.folders.models}/server.js`);
client.TwitterWatchModel = require(`${client.config.folders.models}/twitterwatch.js`);
client.WatcherModel = require(`${client.config.folders.models}/watcher.js`);
// Synchronize Databases (Create tables)
synchronize();

// =====Event Handlers=====

// On client connection to Discord
client.on('ready', () => {
	client.onReady.func(client);
});

// When message is received
client.on('message', message => {
	client.onMessage.func(client, message);
});

// On member join
client.on('guildMemberAdd', member => {
    //member.guild.channels.get('channelID').send("Welcome"); 
});

// On the client joining a server
client.on('guildCreate', guild => {
	client.onGuildCreate.func(client, guild);
});


// Start the client
client.login(client.auth.token);
client.on('error', log.error); // If there's an error, emit an error to the logger
client.on('warn', log.warn); // If there's a warning, emit a warning to the logger

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
client.watcherEnable = (watcher, watcherData) => {
	return new Promise(async (resolve, reject) => {
		try {
			const watchProps = require(`${client.config.folders.watchers}/${watcher}.js`); // Loads watcher
			client.watchers.set(watcher, watchProps); // Add to client's collection of watchers
			client.watchers.get(watcher).watcher(client); // Initialise watcher
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
client.watcherDisable = (watcher, watcherData) => {
	return new Promise(async (resolve, reject) => {
		try {
			client.watchers.get(watcher).disable(); // Disable watcher's function
			await watcherData.update({globalEnable: false}); // Set watcher to disabled in database
			delete require.cache[require.resolve(`${client.config.folders.watchers}/${watcher}.js`)]; // Delete watcher from cache
			client.watchers.delete(watcher); // Delete from client's collection of watchers
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
client.watcherReload = watcher => {
	return new Promise((resolve, reject) => {
		try {
			client.watchers.get(watcher).disable(); // Disable watcher's function
			delete require.cache[require.resolve(`${client.config.folders.watchers}/${watcher}.js`)]; // Delete watcher from cache
			client.watchers.delete(watcher); // Delete from client's collection of watchers
			const watchProps = require(`${client.config.folders.watchers}/${watcher}.js`); // Loads watcher
			client.watchers.set(watcher, watchProps); // Add to client's collection of watchers
			client.watchers.get(watcher).watcher(client); // Initialise watcher
			resolve();
		} catch (err) {
			log.error(`Error when reloading a watcher: ${err}`);
			reject(err);
		}
	});
};

client.schedule = (message, time) => {
	var schedule = require('node-schedule');
	schedule.scheduleJob(time, function(/*fireDate*/){
		const time = new Discord.Collection();
		//message.channel.send('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
		time.set(message);
		time.edit(`Current time is: \`\`\`${new Date()}\`\`\` or \`\`\`${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}\`\`\` `);
	});
};

async function synchronize() {
	await client.CommandModel.sync();
	await client.CountdownModel.sync();
	await client.MuteModel.sync();
	await client.ProfilesModel.sync();
	await client.ServerModel.sync();
	await client.TwitterWatchModel.sync();
	await client.WatcherModel.sync();
}
