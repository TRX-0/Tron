exports.data = {
	name: 'Server Setup',
	command: 'setup',
	description: 'Setup specific server options. Without arguments will return role ids.',
	group: 'system',
	syntax: 'setup [perm3] [perm2] [perm1]',
	author: 'Aris A.',
	permissions: 4
};

const moment = require('moment');
const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Server = require(`${config.folders.models}/server.js`);

exports.func = async (msg,args) => {
	try {
		if(args[0] && args[1] && args[2]){
			const server = await Server.findOne({
				where: {
					guildId: msg.guild.id
				}
			});
			log.verbose(`(${msg.author.tag} has started to setup a server in #${msg.channel.name} on ${msg.guild.name}.`);
			if (server){
				await server.update({
					perm3: [args[0]],
					perm2: [args[1]],
					perm1: [args[2]]
				});
				msg.delete().catch(O_o=>{});
				msg.reply('Server has been set up.');
				log.verbose(`(${msg.author.tag} has finished setting up ${msg.guild.name}.`);
			} else {
				msg.reply('Something went wrong. Did not find server in db.');
			}
		} else {
			let roleList = '';
			msg.guild.roles.keyArray().forEach(key => roleList += `${msg.guild.roles.get(key).name}: ${key}\n`);
			const dm = await msg.author.createDM();
			dm.send(`\`\`\`${roleList}\`\`\``);
		}
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
