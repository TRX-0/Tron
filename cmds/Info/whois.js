exports.data = {
	name: 'Whois',
	description: 'Gets information about a user.',
	group: 'Info',
	command: 'whois',
	syntax: 'whois [@user/username]',
	author: 'TRX',
	permissions: 1,
	anywhere: false
};

const Discord = require('discord.js');

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if (args[0]){
			let GuildMember;
			if (args[0].includes('@')){
				GuildMember = msg.mentions.members.first();
			} else {
				const GuildMembers = await msg.guild.members.cache;
				await GuildMembers.forEach(guildMember => {
					if ((guildMember.user.username.toLowerCase() == args[0].toLowerCase()) || (guildMember.nickname && (guildMember.nickname.toLowerCase() == args[0].toLowerCase()))) {
						GuildMember = guildMember;
					}
				});
			}
			if (GuildMember != null) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(`Information about ${GuildMember.user.tag}`, GuildMember.user.avatarURL())
					.setColor(0xff8000)
					.setThumbnail(GuildMember.user.avatarURL())
					.addField('Username:', GuildMember.user.username, true)
					.addField('Discriminator:', GuildMember.user.discriminator, true)
					.addField('Discord ID:', GuildMember.user.id, false)
					.addField('Status', GuildMember.user.presence.status, false)
					.addField('Created at:', GuildMember.user.createdAt, false)
					.addField('Joined at:', GuildMember.joinedAt)
					.addField('Current roles:', GuildMember.roles.cache.map(role => role.name).sort((a,b) => b.position - a.position).join(' - '), false);
				msg.channel.send('', { embed: embed });
			} else {
				msg.channel.send('User does not exist.');
			}
		} else {
			msg.reply('You did not provide a User.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, someting went wrong: ${err}`);
	}
};
