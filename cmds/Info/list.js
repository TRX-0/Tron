exports.data = {
	name: 'List',
	command: 'list',
	description: 'List bot permissions and roles.',
	group: 'Info',
	syntax: 'list [perms/roles]',
	author: 'TRX',
	permissions: 4
};

const Discord = require('discord.js');

exports.func = (message,args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0]){
			switch (args[0]){
			case 'perms':{
				const embed = new Discord.MessageEmbed()
					.setTitle(`__Bot Permissions in: ${message.channel.guild}__`)
					.setColor(10724865)
					.addField('Administrator',message.guild.me.hasPermission('ADMINISTRATOR'), true)
					.addField('Send Messages',message.guild.me.hasPermission('SEND_MESSAGES'), true)
					.addField('Manage Messages',message.guild.me.hasPermission('MANAGE_MESSAGES'), true)
					.addField('Send TTS Messages',message.guild.me.hasPermission('SEND_TTS_MESSAGES'), true)
					.addField('Embed Links',message.guild.me.hasPermission('EMBED_LINKS'), true)
					.addField('Attach Files',message.guild.me.hasPermission('ATTACH_FILES'), true)
					.addField('Read Message History',message.guild.me.hasPermission('READ_MESSAGE_HISTORY'), true)
					.addField('Mention Everyone',message.guild.me.hasPermission('MENTION_EVERYONE'), true)
					.addField('Create Insant Invite',message.guild.me.hasPermission('CREATE_INSTANT_INVITE'), true)
					.addField('Mute Members',message.guild.me.hasPermission('MUTE_MEMBERS'), true)
					.addField('Kick Members',message.guild.me.hasPermission('KICK_MEMBERS'), true)
					.addField('Ban Members',message.guild.me.hasPermission('BAN_MEMBERS'), true)
					.addField('Manage Channels',message.guild.me.hasPermission('MANAGE_CHANNELS'), true)
					.addField('Manage Guild',message.guild.me.hasPermission('MANAGE_GUILD'), true)
					.addField('Manage Webhooks',message.guild.me.hasPermission('MANAGE_WEBHOOKS'), true)
					.addField('Connect',message.guild.me.hasPermission('CONNECT'), true)
					.addField('Speak',message.guild.me.hasPermission('SPEAK'), true)
					.addField('Deafen Members',message.guild.me.hasPermission('DEAFEN_MEMBERS'), true)
					.addField('Move Members',message.guild.me.hasPermission('MOVE_MEMBERS'), true)
					.addField('Use VAD',message.guild.me.hasPermission('USE_VAD'), true)
					.addField('Change Nickname',message.guild.me.hasPermission('CHANGE_NICKNAME'), true)
					.addField('Manage Nicknames',message.guild.me.hasPermission('MANAGE_NICKNAMES'), true)
					.addField('Manage Roles',message.guild.me.hasPermission('MANAGE_ROLES'), true);
				message.author.send('', { embed: embed });
				message.delete();
				log.info(`${message.author.tag} has listed permissions in ${message.channel.guild}`);
				break;
			}
			case 'roles':{
				const embed = new Discord.MessageEmbed()
					.setTitle(`__Roles in: ${message.channel.guild}__`)
					.setDescription(message.guild.roles.cache.map((m) => m.name).join(', '))
					.setColor(10724865);
					message.author.send('', { embed: embed });
				break;
			}
			default: {
				message.reply('Correct syntax is: list ``perms`` | ``roles`` ');
			}
			}
		} else {
			message.reply('You did not provide any arguments.');
		}
		
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Something went wrong while getting permissions: ${err}`);
	}
};