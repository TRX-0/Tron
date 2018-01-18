exports.data = {
	name: 'Ping',
	command: 'ping',
	description: 'Ping check.',
	group: 'system',
	syntax: 'ping',
	author: 'Aris A.',
	permissions: 2
};
const ping = require('ping');
const moment = require('moment');
const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args) => {
	try {
		if (args[0]){
			ping.sys.probe(args[0], function(isAlive){
				msg.channel.send(isAlive ? 'Host ' + args[0] + ' is alive' : 'Host ' + args[0] + ' is dead');
			});
			log.verbose(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has pinged $args[0] in #${msg.channel.name} on ${msg.guild.name}.`);
		} else {
			log.verbose(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has pinged the bot in #${msg.channel.name} on ${msg.guild.name}.`);
			msg.channel.send('Pls wait.')
				.then(m => m.edit(`🏓 Took ${moment().diff(m.createdAt)} ms.`));
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong: ${err}`);
	}
};
