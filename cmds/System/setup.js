exports.data = {
	name: 'Setup',
	command: 'setup',
	description: 'Setup specific server options. Without arguments will return role ids.',
	group: 'System',
	syntax: 'setup [perm3] [perm2] [perm1]',
	author: 'Aris A.',
	permissions: 4
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Setup');
	try {
		if(args[0] && args[1] && args[2]){
			const server = await msg.client.Server.findOne({
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
				msg.delete();
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
