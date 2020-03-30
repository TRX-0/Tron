exports.data = {
	name: 'Unmute',
	description: 'Unmutes a specific user.',
	group: 'Moderator',
	command: 'unmute',
	syntax: 'unmute [@name]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (message, args) => {
	const OTS = require(`${message.client.config.folders.models}/mute.js`);
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0] == undefined) {
			return message.reply('You did not provide a name.');
		}
		const Member = await message.client.findUser.func(args[0], message);
		if (Member == null) {
			return message.reply('User does not exist.');
		}
		const OTSSettings = await OTS.findOne({
			where: {
				guildId: message.channel.guild.id
			}
		});
		if (!OTSSettings) {
			return message.reply(`OTS Role has not been set up in ${message.guild.name}.`);
		}
		if (!Member.roles.cache.has(OTSSettings.roleId)) {
			return message.reply('User is not muted!');
		}
		let botspam;
		Member.roles.remove(OTSSettings.roleId);
		await message.guild.channels.cache.forEach(async channel => {
			if (channel.id != OTSSettings.botspamChannelId) {
				if (channel.type == 'text') {

					await channel.permissionOverwrites.forEach( overwrite => {
						if (overwrite.id == Member.id) {
							overwrite.delete();
						}
					});
				}
			} else {
				botspam = channel;
			}
		});
		message.reply(`${Member.user.tag} has been unmuted.`);
		botspam.send(`${Member} You have been unmuted by ${message.author.tag}.`);
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} I could not remove the mute because of : ${err}`);
	}
};