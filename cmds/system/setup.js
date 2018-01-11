exports.data = {
	name: 'Server Setup',
	command: 'setup',
	description: 'Setup specific server options.',
	group: 'system',
	syntax: 'setup',
	author: 'Matt C: matt@artemisbot.uk',
	permissions: 4
};

const moment = require('moment');
const log = require('../../lib/log.js')(exports.data.name);
const Server = require('../../lib/models/server');

exports.func = async msg => {
	try {
		/*
		Log.verbose(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has started to setup a server in #${msg.channel.name} on ${msg.guild.name}.`);
		const server = await Server.findOne({
			where: {
				guildId: msg.guild.id
			}
		});
		await server.update({
			permitChan: ['313439402762305536'],
			perm3: ['131868177851351040', '206865957333893120', '211058344344027136'],
			perm2: ['133690689144750080', '132603053906853888'],
			perm1: ['131888041777168384', '211835000587288576'],
			emotes: false,
			quotes: false
		});
		msg.reply('Server has been set up.');
		*/
		let roleList = '';
		msg.guild.roles.keyArray().forEach(key => roleList += `${msg.guild.roles.get(key).name}: ${key}\n`);
		// Msg.reply(roleList);
		const dm = await msg.author.createDM();
		dm.send(`\`\`\`${roleList}\`\`\``);
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
