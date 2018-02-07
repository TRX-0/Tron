exports.data = {
	name: 'Setup',
	command: 'setup',
	description: 'Setup specific server options. Without arguments will return role ids.',
	group: 'System',
	syntax: 'setup [optional:ots] [perm3] [perm2] [perm1] [optional: otsrole]',
	author: 'Aris A.',
	permissions: 4
};

exports.func = async (msg,args) => {
	const OTS = require(`${msg.client.config.folders.models}/otsroles.js`);
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Setup');
	try {
		if(args[0] && args[1] && args[2] && !args[3]){
			var Array = [];
			args.forEach(arg => Array = Array.concat(arg.split(',')));
			let Wrong = false;
			await Array.forEach(element => {
				if (!msg.guild.roles.has(element)){
					Wrong = true;
				}
			});
			if (Wrong == true){
				return msg.reply('The IDs given are incorrect.');
			}
			const server = await msg.client.Server.findOne({
				where: {
					guildId: msg.guild.id
				}
			});
			if (server){
				log.verbose(`(${msg.author.tag} has started to setup a server in #${msg.channel.name} on ${msg.guild.name}.`);
				await server.update({
					perm3: args[0].split(','),
					perm2: args[1].split(','),
					perm1: args[2].split(',')
				});
				msg.delete();
				msg.reply('Server has been set up.');
				log.verbose(`(${msg.author.tag} has finished setting up ${msg.guild.name}.`);
			} else {
				msg.reply('Could not find server in db.');
			}
		} else if (args[0] && args[1] && args[0] == 'ots') {
			if (!msg.guild.roles.has(args[1])){
				return msg.reply('The ID given is incorrect.');
			}
			const OTSRole = await OTS.findOne({
				where: {
					guildId: msg.guild.id
				}
			});
			if (OTSRole){
				await OTSRole.update({
					roleId: args[1]
				});
			} else {
				await OTS.create({
					guildId: msg.guild.id,
					roleId: args[1]
				});
			}
			msg.reply('OTS role has been successfully setup');
			log.info(`${msg.author.tag} has finished setting up OTS role in ${msg.guild.name}`);
		} else if (!args[0]){
			let roleList = '';
			msg.guild.roles.keyArray().forEach(key => roleList += `${msg.guild.roles.get(key).name}: ${key}\n`);
			const dm = await msg.author.createDM();
			dm.send(`\`\`\`${roleList}\`\`\``);
		} else {
			msg.reply('Wrong arguments!');
		}
	} catch (err) {
		msg.reply('Something went wrong!');
		log.error(`Something went wrong: ${err}`);
	}
};
