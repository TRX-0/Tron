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
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Unmute');
	try{
		if (args[0]){
			let Member;
			if (args[0].includes('@')){
				Member = msg.mentions.members.first();
			} else {
				const Users = await msg.guild.members;
				var Found = false;
				await Users.forEach(user => {
					if ( (user.user.username.toLowerCase() == args[0].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase()))) {
						Found = true;
						Member = user;
					}
				});
				if (!Found) {
					return msg.channel.send('User does not exist.');
				}
			}
			const OTSSettings = await OTS.findOne({
				where: {
					guildId: msg.channel.guild.id
				}
			});
			if (OTSSettings) {
				if(Member.roles.has(OTSSettings.roleId)){
					const muteAppeal = msg.guild.channels.get(OTSSettings.mutedChannelId);
					await Member.removeRole(OTSSettings.roleId);
					//Loop Channels
					await msg.guild.channels.forEach(channel => {
						if(channel.id != muteAppeal.id){
							if(channel.type == 'text'){
								let MemberOverwrite = channel.permissionOverwrites.get(Member.id);
								if(MemberOverwrite){
									channel.permissionOverwrites.get(Member.id).delete();
								}
							}
						}
					});
					const botspam = msg.guild.channels.get(OTSSettings.botspamChannelId);
					await botspam.send(`${Member} You have been unmuted by ${msg.author.tag}.`);
				} else {
					msg.reply('User is not muted.');
				}
			} else {
				msg.reply(`Muted Role has not been set in ${msg.guild.name}.`);
			}
		} else {
			msg.reply('You did not provide a name.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} I could not remove the mute because of : ${err}`);
	}
};