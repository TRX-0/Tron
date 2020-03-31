exports.data = {
	name: 'Setup',
	command: 'setup',
	description: 'Setup specific server options. Without arguments will return role ids.',
	group: 'System',
	syntax: 'setup (ots [Muted Role] [Mute Appeal Channel] [Botspam Channel]) / ([High1,High2] [Medium1,Medium2] [Lowest] / (prefix [prefix]))',
	author: 'TRX',
	permissions: 4
};

exports.func = async (message, args) => {
	const OTS = require(`${message.client.config.folders.models}/mute.js`);
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if(args.length == 3){
			var Array = [];
			args.forEach(arg => Array = Array.concat(arg.split(',')));
			let Wrong = false;
			await Array.forEach(element => {
				if (!message.guild.roles.cache.has(element)){
					Wrong = true;
				}
			});
			if (Wrong == true){
				return message.reply('The IDs given are incorrect.');
			}
			const server = await message.client.ServerModel.findOne({
				where: {
					guildId: message.guild.id
				}
			});
			if (server){
				log.verbose(`${message.author.tag} has started to setup a server in #${message.channel.name} on ${message.guild.name}.`);
				await server.update({
					perm3: args[0].split(','),
					perm2: args[1].split(','),
					perm1: args[2].split(',')
				});
				message.delete();
				message.reply('Server has been set up.');
				log.verbose(`${message.author.tag} has finished setting up ${message.guild.name}.`);
			} else {
				message.reply('Could not find server in db.');
			}
		} else if (args.length == 4 && args[0] == 'ots') {
			if (!message.guild.roles.cache.has(args[1])) {
				return message.reply('The role ID given is incorrect.');
			}
			if (!message.guild.channels.cache.has(args[2]) || !message.guild.channels.cache.has(args[3])) {
				return message.reply('The channel IDs given are incorrect.');
			}
			const OTSdb = await OTS.findOne({
				where: {
					guildId: message.guild.id
				}
			});
			if (OTSdb) {
				await OTSdb.update({
					roleId: args[1],
					mutedChannelId: args[2],
					botspamChannelId: args[3]
				});
			} else {
				await OTS.create({
					guildId: message.guild.id,
					roleId: args[1],
					mutedChannelId: args[2],
					botspamChannelId: args[3]
				});
			}
			message.delete();
			message.reply('OTS has been set up');
			log.info(`${message.author.tag} has finished setting up OTS role in ${message.guild.name}`);
		} else if (args.length == 2 && args[0] == 'prefix') {
			const server = await message.client.ServerModel.findOne({
				where: {
					guildId: message.guild.id
				}
			});
			if (server){
				await server.update({
					altPrefix: args[1]
				});
				message.delete();
				message.reply('Prefix has been set up.');
				log.verbose(`${message.author.tag} has changed the prefix of ${message.guild.name}.`);
			} else {
				message.reply('Could not find server in db.');
			}
		} else if (!args[0]){
			message.delete();
			let roleList = '';
			message.guild.roles.cache.forEach(key => roleList += `${message.guild.roles.resolve(key).name}: ${key.id}\n`);
			const dm = await message.author.createDM();
			dm.send(`\`\`\`${roleList}\`\`\``);
		} else {
			message.reply('Wrong arguments!');
		}
	} catch (err) {
		message.reply('Something went wrong!');
		log.error(`Something went wrong: ${err}`);
	}
};
