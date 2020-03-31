exports.data = {
	name: 'Mute',
	description: 'Mutes a specific user.',
	group: 'Moderator',
	command: 'mute',
	syntax: 'mute [@name/username] [reason]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (message, args) => {
	const OTS = require(`${message.client.config.folders.models}/mute.js`);
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0] == undefined) {
			return message.reply('You did not provide a name.');
		}
		const Member = await message.client.findUser.func(args[0], message);
		if (Member == null) {
			return message.reply('User does not exist.');
		}
		if (Member.permissions.has('ADMINISTRATOR')) {
			return message.reply('User is an Administrator and cannot be muted.');
		}
		const OTSSettings = await OTS.findOne({
			where: {
				guildId: message.channel.guild.id
			}
		});
		if (!OTSSettings) {
			return message.reply(`OTS Role has not been set up in ${message.guild.name}.`);
		}
		if (Member.roles.cache.has(OTSSettings.roleId)) {
			return message.reply('User is already muted!');
		}
		let reason = args.slice(1).join(' ');
		let muteAppeal;
		Member.roles.add(OTSSettings.roleId);
		await message.guild.channels.cache.forEach(channel => {
			if (channel.id != OTSSettings.mutedChannelId) {
				if (channel.type == 'text') {
					channel.overwritePermissions([{
						id: Member.id,
						deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'SEND_TTS_MESSAGES']
					}], reason);
				}
			} else {
				muteAppeal = channel;
			}
		});
		message.reply(`${Member.user.tag} has been muted.`);
		muteAppeal.send(`${Member} You have been muted by ${message.author.tag}. You can appeal the mute here.`);
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} I could not mute because of : ${err}`);
	}
};