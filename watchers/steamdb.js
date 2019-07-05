// ===============| Initialisation |===============

exports.data = {
	name: 'SteamDB Application Watcher',
	command: 'steamdb'
};

// Loads required modules
const chalk = require('chalk');
const Discord = require('discord.js');
const jetpack = require('fs-jetpack');
const moment = require('moment');
const snek = require('snekfetch');
const strftime = require('strftime');
const log = require('../lib/log.js')(exports.data.name);
const Watcher = require('../lib/models/watcher');

// Makes repeats global
const hasUpdate = {};
let repeat;

// ================| Helper Functions |================

const clean = str => {
	return str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>|<link\b[^>]*>|Email:.+>|data-token=".+?"|email-protection#.+?"|<div class="vc_row wpb_row vc_row-fluid no-margin parallax.+>|data-cfemail=".+?"|<!--[\s\S]*?-->|<meta name="fs-rendertime" content=".+?">|e-mail.cloud/ig, '');
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ================| Main Functions |================
const checkSite = async (AppID) => {
	return new Promise(async (resolve, reject) => {
		const site = `https://steamdb.info/app/${AppID}/depots`;
		try {
			let steamDB = await Watcher.findOne({
				where: {
					watcherName: 'steamdb'
				}
			});
			let data = steamDB.data || {
				channels: [],
				appIDs: {},
			};
			const reqOpts = {headers: {}};
			const req = await snek.get(`${site}?_=${Math.random()}`, reqOpts); // Req.body is a buffer for unknown reasons

			const timestamp = moment();
			const newPage = parse(req.body.toString());
			const oldPage = parse(jetpack.read(`./watcherData/${data.appIDs[AppID]}-latest.html`));

			//const pageCont = clean(req.body.toString());
			//const oldCont = clean(jetpack.read(`./watcherData/${data.appIDs[AppID]}-latest.html`));
			if (newPage.replace(/\s/g, '').replace(/>[\s]+</g, '><').replace(/"\s+\//g, '"/') === oldPage.replace(/\s/g, '').replace(/>[\s]+</g, '><').replace(/"\s+\//g, '"/')) {
				log.debug(`No change on ${site}.`);
				return resolve(hasUpdate[site] = false);
			}
			log.verbose(`There's been a possible change on ${site}`);
			if (hasUpdate[site]) {
				return resolve(log.warn(`${site} only just had an update, there's probably a bug.`));
			}
			await delay(2000);
			const req2 = await snek.get(`${site}?_=${Math.random()}`, reqOpts);
			const pageCont2 = clean(req2.body.toString());
			if (pageCont2 !== pageCont) {
				log.verbose('Update was only temporary. Rejected broadcast protocol.');
				return resolve(hasUpdate[site] = false);
			}
			log.info(`Confirmed change on ${site}`);

			jetpack.write(`./watcherData/${data.sites[site]}-temp.html`, req.body.toString());
			let embedDescription;
			const embed = new Discord.RichEmbed({
				color: 0x993E4D,
				description: embedDescription,
				author: {
					name: `${site.split('/').splice(2).join('/')} has updated`,
					url: site,
					//icon_url: 'https://cdn.artemisbot.uk/img/hexagon.png'
				},
				footer: {
					//icon_url: 'https://cdn.artemisbot.uk/img/watchingtitan.png',
					text: `Watching Titan | ${timestamp.utc().format('dddd, MMMM Do YYYY, HH:mm:ss [UTC]')}`
				}
			});
			log.info('site updated');
			/*wtSites = await Watcher.findOne({
				where: {
					watcherName: 'website'
				}
			});
			data = wtSites.data || {
				channels: [],
				sites: {},
			};*/
			await steamDB.update({data});
			jetpack.remove(`./watcherData/${data.sites[site]}-temp.html`);
			jetpack.write(`./watcherData/${data.sites[site]}-latest.html`, req.body.toString());
			jetpack.write(`./watcherData/${data.sites[site]}-logs/${strftime('%F - %H-%M-%S')}.html`, req.body.toString());
			return resolve(hasUpdate[site] = false);
		} catch (err) {
			if (err.status) {
				log.error(`Failed to check site ${site}. ${err.status}: ${err.statusText}`);
			} else {
				log.error(`Failed to check site ${site}: ${err.stack}`);
			}
			return reject(err);
		}
	});
};

const querySites = async bot => {
	await Watcher.sync();
	const steamDB = await Watcher.findOne({
		where: {
			watcherName: 'steamdb'
		}
	});
	const data = steamDB.data || {
		channels: [],
		appIDs: {},
	};
	try {
		log.debug(`Checking sites: ${Object.values(data.appIDs).join(', ')}`);
		const result = await Promise.all(Object.keys(data.appIDs).map(ID => checkSite(ID)));
		if (!result.includes(true)) {
			log.debug('No changes on any sites.');
		}
		repeat = setTimeout(async () => {
			querySites(bot);
		}, 90 * 1000);
	} catch (err) {
		if (err.status) {
			log.warn('Failed to access a site. Will retry in 90 seconds.');
			repeat = setTimeout(async () => {
				querySites(bot);
			}, 90 * 1000);
		} else {
			log.error(`Site query failed. ${exports.data.name} has been disabled for safety.`);
		}
	}
};

// Starts intervals
exports.watcher = async bot => {
	// In case of restarting this watcher, kill all loops
	this.disable();
	log.verbose(chalk.green(`${exports.data.name} has initialised successfully.`));
	repeat = setTimeout(async () => {
		querySites(bot);
	}, 30 * 1000); // Do this after 30 seconds (not an interval because the bot sets a new timeout when previous execution is complete)
};

exports.start = async (msg, bot, args) => {
	await Watcher.sync();
	const steamDB = await Watcher.findOne({
		where: {
			watcherName: 'steamdb'
		}
	});
	const data = steamDB.data || {
		channels: [],
		appIDs: {}
	};
	if (args[0] > 0) {
		if (!args[1]) {
			return msg.reply('You must supply an alias for this App.');
		}
		if (Object.keys(data.appIDs).map(ID => ID.replace(/https?:\/\//g, '')).includes(args[0].replace(/https?:\/\/|\//g, ''))) {
			return msg.reply('Already watching this App.');
		}
		if (Object.values(data.appIDs).includes(args[1])) {
			return msg.reply('Already watching an App with this alias.');
		}
		log.debug(`Attempting to enable watching of ${args[0]} in #${msg.channel.name} on ${msg.guild.name}.`);
		try {
			const site = await snek.get(`https://steamdb.info/app/${args[0]}/depots/`);
			log.debug('Fetched page.');
			jetpack.write(`./watcherData/${args[1]}-latest.html`, site.body.toString());
			jetpack.write(`./watcherData/${args[1]}-logs/${strftime('%F - %H-%M-%S')}.html`, site.body.toString());
			log.debug('Saved page.');
			data.appIDs[args[0]] = args[1];
			log.debug('Cached address for future searches.');
			steamDB.update({data});
			log.debug(`Now watching ${args[1]} (${args[0]}).`);
			return msg.reply('Now watching this steam App.');
		} catch (err) {
			log.error(`Failed to add new site: ${err}`);
			return msg.reply('Failed to find specified site.');
		}
	} else {
		return msg.reply('You need to supply an App ID.');
	}
};

exports.stop = async (msg, bot, args) => {
	log.info('need to implement this');

};

exports.disable = () => {
	clearTimeout(repeat);
};