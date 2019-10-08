// Initialize Discord Bot
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.config = require('./config.json');
bot.auth = require('./auth.json');
bot.watchers = new Discord.Collection();

// Basic Function Modules
const log = require(`${bot.config.folders.lib}/log.js`)('Core');
bot.Watcher = require(`${bot.config.folders.models}/watcher.js`);
const chalk = require('chalk');

const exec = require('util').promisify(require('child_process').exec);

// Event Handlers
bot.message = require(`${bot.config.folders.events}/message.js`);
bot.ready = require(`${bot.config.folders.events}/ready.js`);

// Database modules
const Database = require(`${bot.config.folders.lib}/db.js`);
bot.Server = require(`${bot.config.folders.models}/server.js`);
bot.CMDModel = require(`${bot.config.folders.models}/commands.js`);
const Profiles = require(`${bot.config.folders.models}/profiles.js`);
bot.db = Database.start(); // Start the database and connect

// ==== Event Handlers ==== //

// On bot connection to Discord
bot.on('ready', () => {
	bot.ready.func(bot);
});

// When message is received
bot.on('message', msg => {
	bot.message.func(bot, msg);
});

// On member join
bot.on('guildMemberAdd', member => {
    //member.guild.channels.get('channelID').send("Welcome"); 
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

//==== Global Helper Functions ====

function emoji(msg){
	if (msg.content == ':yerts:'){
		msg.channel.send('Damn it Yerts...', {file:'https://i.imgur.com/1XpZHPe.gif'});
		log.info(`${msg.author.tag} used the Yerts emoji!`);
		msg.delete();
	}
	return;
}

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