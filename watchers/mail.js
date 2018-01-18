// Modules & Initialisation
exports.data = {
	name: 'Mail Listener',
	command: 'mail',
	description: 'Listens to mail from specified address'
};

const MailListener = require('mail-listener2');
const Discord = require('discord.js');

const config = require('../config.json');
const auth = require('../auth.json');
const MailWatch = require(`${config.folders.models}/mailwatch`);
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

const moment = require('moment');

const ml = new MailListener({
	username: auth.Email.Username,
	password: auth.Email.Password,
	host: auth.Email.Host,
	port: 993, // Imap port
	tls: true,
	debug: log.debug, // Or your custom function with only one incoming argument. Default: null
	mailbox: 'INBOX', // Mailbox to monitor
	searchFilter: ['UNSEEN'], // The search filter being used after an IDLE notification has been retrieved
	markSeen: false, // All fetched email willbe marked as seen and not fetched next time
	mailParserOptions: {
		streamAttachments: true
	}, // Options to be passed to mailParser lib.
	attachments: false
});

exports.watcher = bot => {
	// Startup process for watcher
	this.disable();
	ml.start();
	ml.on('server:connected', () => {
		log.verbose(`${exports.data.name} has initialised successfully and connected to the IMAP server.`);
	});
	ml.on('server:disconnected', () => {
		log.error(`Bot has disconnected from IMAP server.`);
		ml.start();
	});
	ml.on('error', err => {
		log.error(`Issue with IMAP: ${err}`);
	});
	ml.on('mail', async (mail, seqno, attributes) => {
		try {
			log.debug(`New email received from "${mail.from[0].name}" with subject "${mail.subject}".`);
			const mailWatchers = await MailWatch.findAll({where: {address: mail.from[0].address}});
			// Console.log(mailWatchers);
			if (mailWatchers) {
				ml.imap.addFlags(attributes.uid, '\\Seen', err => {
					if (!err) {
						log.debug('Mail has been set as read.');
					}
				});
				log.info(`New email received from "${mail.from[0].name}" with subject "${mail.subject}".`);
				const embed = new Discord.RichEmbed({
					author: {
						name: `A new email has been received from ${mail.from[0].name}`,
						icon_url: 'https://cdn.artemisbot.uk/img/watchingtitan.png'
					},
					description: `**Subject:** ${mail.subject}`,
					color: 0x993E4D,
					footer: {
						text: 'Sent at',
						icon_url: 'https://cdn.artemisbot.uk/img/mail.png'
					},
					timestamp: mail.date
				});
				if (mail.from[0].address === 'info@wakingtitan.com') {
					
				}
				mailWatchers.forEach(async watch => {
					// Send embed to watching discord channels
					bot.channels.get(watch.channelID).send('', {
						embed
					}).catch(log.error);
				});
			}
		} catch (err) {
			log.error(`Something went wrong: ${err}`);
		}
	});
};

exports.start = async (msg, bot, args) => {
	// Process for new channel/watched item
	try {
		if (args.length < 0) {
			return msg.reply('Please add an email address.');
		}
		await MailWatch.sync();
		if (await MailWatch.findOne({where: {address: args[0], channelID: msg.channel.id}})) {
			return msg.reply(`I am already watching ${args[0]} in this channel.`);
		}
		MailWatch.create({
			address: args[0],
			channelID: msg.channel.id
		});
		log.info(`Now watching for mail from "${args[0]}" in ${msg.channel.name} on ${msg.guild.name}.`);
		await msg.reply(`Now watching for mail from "${args[0]}" in this channel.`);
	} catch (err) {
		msg.reply('Couldn\'t watch this address! Check the logs.');
		log.error(`Couldn't start watching a new stream: ${err}`);
	}
};

exports.stop = async (msg, bot, args) => {
	// Process for removing channel/watched item
	try {
		if (args.length < 0) {
			return msg.reply('Please add an email address.');
		}
		await MailWatch.sync();
		if (await MailWatch.findOne({where: {address: args[0], channelID: msg.channel.id}})) {
			MailWatch.destroy({ where: {address: args[0],channelID: msg.channel.id}});
			log.info(`Stopped watching for mail from "${args[0]}" in ${msg.channel.name} on ${msg.guild.name}.`);
			await msg.reply(`Stopped for mail from "${args[0]}" in this channel.`);
		} else {
			await msg.reply(`"${args[0]}" was not being watched.`);
		}
	} catch (err) {
		msg.reply('Couldn\'t remove this address! Check the logs.');
		log.error(`Couldn't stop watching a stream: ${err}`);
	}
};

exports.list = async msg => {
	const fields = (await MailWatch.findAll({where: {channelID: msg.channel.id}})).map(watch => {
		return {
			name: watch.address,
			value: `Created ${moment(watch.createdAt).fromNow()}`
		};
	});
	if (fields.length > 0) {
		msg.reply('', {embed: {
			title: `Mail Watchers running in #${msg.channel.name} on ${msg.guild.name}`,
			fields,
			color: 0x993E4D
		}});
	} else {
		msg.reply('There are no mail watchers in this channel.');
	}
};

exports.disable = () => {
	try {
		ml.stop();
	} catch (err) {
		log.error(`Failed to stop listener: ${err}`);
	}
};
