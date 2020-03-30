exports.data = {
	name: 'Ping',
	command: 'ping',
	description: 'Ping check.',
	group: 'Info',
	syntax: 'ping',
	author: 'TRX',
	permissions: 1
};
const ping = require('ping');
const moment = require('moment');

exports.func = async (message,args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0]){
			ping.sys.probe(args[0], function(isAlive){
				message.channel.send(isAlive ? 'Host ' + args[0] + ' is alive' : 'Host ' + args[0] + ' is dead');
			});
			log.verbose(`${message.author.tag} has pinged $args[0] in #${message.channel.name} on ${message.guild.name}.`);
		} else {
			message.channel.send('Pls wait.').then(m => m.edit(`🏓 Took ${moment().diff(m.createdAt)} ms.`));
			log.verbose(`${message.author.tag} has pinged the bot in #${message.channel.name} on ${message.guild.name}.`);
		}
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Something went wrong: ${err}`);
	}
};
