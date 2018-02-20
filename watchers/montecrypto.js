// ================| Initialisation |================

exports.data = {
	name: 'Montecrypto watcher',
	command: 'montecrypto'
};

// Loads required modules
const chalk = require('chalk');
const Discord = require('discord.js');
const jetpack = require('fs-jetpack');
const moment = require('moment');
const snek = require('snekfetch');
const strftime = require('strftime');

const config = require('../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Watcher = require(`${config.folders.models}/watcher`);

// Makes repeats global

const hasUpdate = {
	'https://montecrypto-game.github.io/': false,
	'https://github.com/montecrypto-game/montecrypto-game.github.io/commits/master': false,
	'https://github.com/montecrypto-game/montecrypto-game.github.io': false,
	'https://twitter.com/montecryptogame': false
};
let repeat;

// ================| Helper Functions |================

const clean = str => {
	return str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>|<link\b[^>]*>|Email:.+>|data-token=".+?"|email-protection#.+"|<div class="vc_row wpb_row vc_row-fluid no-margin parallax.+>|data-cfemail=".+?"|<!--[\s\S]*?-->/ig, '');
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ================| Main Functions |================
const checkSite = async (site, bot) => {
	return new Promise(async (resolve, reject) => {
		try {
			const wtSites = await Watcher.findOne({
				where: {
					watcherName: 'montecrypto'
				}
			});
			const data = wtSites.data || {
				channels: [],
				sites: {},
				glyphs: []
			};
			const reqOpts = {headers: {}};
			const req = await snek.get(site, reqOpts); // Req.body is a buffer for unknown reasons
			const pageCont = clean(req.body.toString());
			const oldCont = clean(jetpack.read(`./watcherData/${data.sites[site]}-latest.html`));
			if (pageCont.replace(/\s/g, '').replace(/>[\s]+</g, '><').replace(/"\s+\//g, '"/') === oldCont.replace(/\s/g, '').replace(/>[\s]+</g, '><').replace(/"\s+\//g, '"/')) {
				log.debug(`No change on ${site}.`);
				return resolve(hasUpdate[site] = false);
			}
			log.verbose(`There's been a possible change on ${site}`);
			if (hasUpdate[site]) {
				return resolve(log.warn(`${site} only just had an update, there's probably a bug.`));
			}
			await delay(5000);
			const req2 = await snek.get(site, reqOpts);
			const pageCont2 = clean(req2.body.toString());
			if (pageCont2 !== pageCont) {
				log.verbose('Update was only temporary. Rejected broadcast protocol.');
				return resolve(hasUpdate[site] = false);
			}
			log.info(`Confirmed change on ${site}`);
			const embed = new Discord.RichEmbed({
				color: 0x993E4D,
				timestamp: moment().toISOString(),
				author: {
					name: `${site.split('/').splice(2).join('/')} has updated`,
					url: site,
				},
				footer: {
					text: 'Crypto Watcher'
				}
			});
			jetpack.write(`./watcherData/${data.sites[site]}-temp.html`, req.body.toString());
			for (const channel of data.channels) {
				await bot.channels.get(channel).send('', {
					embed
				});
			}
			await snek.get(`https://web.archive.org/save/${site}`);
			jetpack.remove(`./watcherData/${data.sites[site]}-temp.html`);
			jetpack.write(`./watcherData/${data.sites[site]}-latest.html`, req.body.toString());
			jetpack.write(`./watcherData/${data.sites[site]}-logs/${strftime('%F - %H-%M-%S')}.html`, req.body.toString());
			return resolve(hasUpdate[site] = true);
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

// Checks for updates on waking titan sites
const querySites = async bot => {
	await Watcher.sync();
	const wtSites = await Watcher.findOne({
		where: {
			watcherName: 'montecrypto'
		}
	});
	const data = wtSites.data || {
		channels: [],
		sites: {},
		glyphs: []
	};
	try {
		await Promise.all(Object.keys(data.sites).map(site => checkSite(site, bot)));
		repeat = setTimeout(async () => {
			querySites(bot);
		}, 30 * 1000);
	} catch (err) {
		if (err.status) {
			log.warn('Failed to access a site. Will retry in 30 seconds.');
			repeat = setTimeout(async () => {
				querySites(bot);
			}, 30 * 1000);
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
	const wtSites = await Watcher.findOne({
		where: {
			watcherName: 'montecrypto'
		}
	});
	const data = wtSites.data || {
		channels: [],
		sites: {},
		glyphs: []
	};
	if (args[0]) {
		if (!args[1]) {
			return msg.reply('You must supply an alias for this site.');
		}
		if (Object.keys(data.sites).map(site => site.replace(/https?:\/\//g, '')).includes(args[0].replace(/https?:\/\/|\//g, ''))) {
			return msg.reply('Already watching this site.');
		}
		if (Object.values(data.wtSites.sites).includes(args[1])) {
			return msg.reply('Already watching a site with this alias.');
		}
		try {
			const body = await snek.get(args[0]);
			jetpack.write(`./watcherData/${args[1]}-latest.html`, body);
			jetpack.write(`./watcherData/${args[1]}-logs/${strftime('%F - %H-%M-%S')}.html`, body);
			data.sites[args[0]] = args[1];
			wtSites.update({data});
			return msg.reply('Now globally watching this site.');
		} catch (err) {
			return msg.reply('Failed to find specified site.');
		}
	} else {
		if (data.channels.includes(msg.channel.id)) {
			return msg.reply('Already watching for MonteCrypto updates in this channel.');
		}
		data.channels.push(msg.channel.id);
		msg.reply('Now watching for MonteCrypto changes in this channel.');
		log.info(`Now watching in #${msg.channel.name} on ${msg.guild.name}.`);
		wtSites.update({data});
	}
};

exports.disable = () => {
	clearTimeout(repeat);
};
