// ================| Initialisation |================

exports.data = {
	name: 'Waking Titan Sites & Glyphs',
	command: 'wt-sites'
};

// Loads required modules
const chalk = require('chalk');
const CSSselect = require('css-select');
const Discord = require('discord.js');
const htmlparser = require('htmlparser2');
const jetpack = require('fs-jetpack');
const moment = require('moment');
const snek = require('snekfetch');
const strftime = require('strftime');

const config = require('../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Watcher = require(`${config.folders.models}/watcher`);

// Makes repeats global

const hasUpdate = {
	'https://echo-64.com': false,
	'https://atlas-65.com': false,
	'https://superlumina-6c.com': false,
	'https://myriad-70.com': false,
	'https://multiverse-75.com': false,
	'https://wakingtitan.com': false,
	'http://csd.atlas-65.com': false,
	'https://project-wt.com': false,
	'https://www.nomanssky.com': false,
	'https://ware-tech.cloud': false
};
let repeat;

// ================| Helper Functions |================

const clean = str => {
	return str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>|<link\b[^>]*>|Email:.+>|data-token=".+?"|email-protection#.+"|<div class="vc_row wpb_row vc_row-fluid no-margin parallax.+>|data-cfemail=".+?"|<!--[\s\S]*?-->/ig, '');
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ================| Main Functions |================

// Checks status of glyphs on wakingtitan.com
const checkGlyphs = async bot => {
	try {
		const wtSites = await Watcher.findOne({
			where: {
				watcherName: 'wt-sites'
			}
		});
		const data = wtSites.data || {
			channels: [],
			sites: {},
			glyphs: []
		};
		const req = await snek.get('https://wakingtitan.com');
		const glyphs = [];
		let change = false;
		const handler = new htmlparser.DomHandler(error => {
			if (error) {
				log.error(error);
			}
		});
		const parser = new htmlparser.Parser(handler);
		parser.write(req.body);
		parser.done();
		const disGlyph = CSSselect('a[class=glyph]', handler.dom);
		for (const element of disGlyph) {
			glyphs.push(element.attribs.style.split('(')[1].slice(0, -1));
		}
		for (let i = 0; i < glyphs.length; i++) {
			if (glyphs.sort()[i] !== data.glyphs[i]) {
				log.info('New glyph at wakingtitan.com');
				const embed = new Discord.RichEmbed({
					color: 0x993E4D,
					timestamp: moment().toISOString(),
					description: 'That\'s good, innit!',
					footer: {
						icon_url: 'https://cdn.artemisbot.uk/img/watchingtitan.png',
						text: 'Watching Titan'
					},
					author: {
						name: 'New glyph has activated!',
						url: 'https://wakingtitan.com',
						icon_url: 'https://cdn.artemisbot.uk/img/hexagon.jpg'
					},
					thumbnail: {
						url: `http://wakingtitan.com${glyphs.sort()[i]}`
					}
				});
				for (const channel of data.channels) {
					await bot.channels.get(channel).send('', {
						embed
					});
				}
				const resp = await snek.get(`http://wakingtitan.com${glyphs.sort()[i]}`);
				jetpack.write(`watcherData/glyphs/glyph${glyphs.sort()[i].split('/').slice(-1)[0]}`, resp.body);
				await delay(30 * 1000);
				change = true;
			}
		}
		if (change) {
			data.glyphs = glyphs.sort();
			wtSites.update({data});
		}
	} catch (err) {
		log.error(`Failed check for new glyphs: ${err.stack}`);
	}
};

const checkSite = async (site, bot) => {
	return new Promise(async (resolve, reject) => {
		try {
			const wtSites = await Watcher.findOne({
				where: {
					watcherName: 'wt-sites'
				}
			});
			const data = wtSites.data || {
				channels: [],
				sites: {},
				glyphs: []
			};
			const reqOpts = {headers: {}};
			if (site === 'https://wakingtitan.com') {
				reqOpts.headers.Cookie = 'terminal=%5B%22atlas%22%2C%22csd%22%2C%222fee0b5b-6312-492a-8308-e7eec4287495%22%2C%2205190fed-b606-4321-a52e-c1d1b39f2861%22%2C%22f7c05c4f-18a5-47a7-bd8e-804347a15f42%22%5D; archive=%5B%229b169d05-6b0b-49ea-96f7-957577793bef%22%2C%2267e3b625-39c0-4d4c-9241-e8ec0256b546%22%2C%224e153ce4-0fec-406f-aa90-6ea62e579369%22%2C%227b9bca5c-43ba-4854-b6b7-9fffcf9e2b45%22%2C%222f99ac82-fe56-43ab-baa6-0182fd0ed020%22%2C%22b4631d12-c218-4872-b414-9ac31b6c744e%22%2C%227b34f00f-51c3-4b6c-b250-53dbfaa303ef%22%2C%2283a383e2-f4fc-4d8d-905a-920057a562e7%22%2C%227ed354ba-b03d-4c56-ade9-3655aff45179%22%5D';
			}
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
					icon_url: 'https://cdn.artemisbot.uk/img/hexagon.png'
				},
				footer: {
					icon_url: 'https://cdn.artemisbot.uk/img/watchingtitan.png',
					text: 'Watching Titan'
				}
			});
			jetpack.write(`./watcherData/${data.sites[site]}-temp.html`, req.body.toString());
			if (site === 'https://wakingtitan.com') {
				checkGlyphs(bot);
			}
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
			watcherName: 'wt-sites'
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
		}, 15 * 1000);
	} catch (err) {
		if (err.status) {
			log.warn('Failed to access a site. Will retry in 30 seconds.');
			repeat = setTimeout(async () => {
				querySites(bot);
			}, 15 * 1000);
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
			watcherName: 'wt-sites'
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
			return msg.reply('Already watching for Waking Titan site & glyph changes in this channel.');
		}
		data.channels.push(msg.channel.id);
		msg.reply('Now watching for Waking Titan site & glyph changes in this channel.');
		log.info(`Now watching in #${msg.channel.name} on ${msg.guild.name}.`);
		wtSites.update({data});
	}
};

exports.stop = async (msg) => {
	msg.channel.send('This has not been set-up yet. Contact Aris.');
};

exports.disable = () => {
	clearTimeout(repeat);
};
