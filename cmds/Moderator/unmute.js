exports.data = {
	name: 'Unmute',
	description: 'Unmutes a specific user.',
	group: 'Moderator',
	command: 'unmute',
	syntax: 'unmute [@name]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const OTS = require(`${msg.client.config.folders.models}/mute.js`);
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0] == undefined) {
			return msg.reply('You did not provide a name.');
		}

		let Member;
		if (msg.mentions.users.first() != undefined) {
			Member = msg.mentions.members.first();
		}
		else {
			const GuildMembers = await msg.guild.members.cache;
			await GuildMembers.forEach(guildMember => {
				if ((guildMember.user.username.toLowerCase() == args[0].toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == args[0].toLowerCase()))) {
					Member = guildMember;
				}
			});
			if (Member == undefined) {
				return msg.reply('User does not exist.');
			}
		}

		const OTSSettings = await OTS.findOne({
			where: {
				guildId: msg.channel.guild.id
			}
		});
		if (!OTSSettings) {
			return msg.reply(`OTS Role has not been set up in ${msg.guild.name}.`);
		}
		if (!Member.roles.cache.has(OTSSettings.roleId)) {
			return msg.reply('User is not muted!');
		}
		let reason = args.slice(1).join(' ');
		let botspam;
		Member.roles.remove(OTSSettings.roleId);
		await msg.guild.channels.cache.forEach(async channel => {
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
		msg.reply(`${Member.user.tag} has been unmuted.`);
		botspam.send(`${Member} You have been unmuted by ${msg.author.tag}.`);
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} I could not remove the mute because of : ${err}`);
	}
};