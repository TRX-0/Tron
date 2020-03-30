exports.data = {
	name: 'Mute',
	description: 'Mutes a specific user.',
	group: 'Moderator',
	command: 'mute',
	syntax: 'mute [@name/username] [reason]',
	author: 'TRX',
	permissions: 3,
};

//function ParseDate(givenTime){
//	const Values = givenTime.match(/([1-9][smhdwMy])/g);
//}

exports.func = async (msg, args) => {
	const OTS = require(`${msg.client.config.folders.models}/mute.js`);
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
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
		if (Member.roles.cache.has(OTSSettings.roleId)) {
			return msg.reply('User is already muted!');
		}
		let reason = args.slice(1).join(' ');
		let muteAppeal;
		Member.roles.add(OTSSettings.roleId);
		await msg.guild.channels.cache.forEach(channel => {
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
		msg.reply(`${Member.user.tag} has been muted.`);
		muteAppeal.send(`${Member} You have been muted by ${msg.author.tag}. You can appeal the mute here.`);
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} I could not mute because of : ${err}`);
	}
};