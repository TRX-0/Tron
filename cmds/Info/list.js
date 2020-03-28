exports.data = {
	name: 'List',
	command: 'list',
	description: 'List bot permissions and roles.',
	group: 'Info',
	syntax: 'list [perms/roles]',
	author: 'Aris A,',
	permissions: 4
};

const Discord = require('discord.js');

exports.func = (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		if (args[0]){
			switch (args[0]){
			case 'perms':{
				const embed = new Discord.RichEmbed()
					.setTitle(`__Bot Permissions in: ${msg.channel.guild}__`)
					.setColor(10724865)
					.addField('Administrator',msg.guild.me.hasPermission('ADMINISTRATOR'), true)
					.addField('Send Messages',msg.guild.me.hasPermission('SEND_MESSAGES'), true)
					.addField('Manage Messages',msg.guild.me.hasPermission('MANAGE_MESSAGES'), true)
					.addField('Send TTS Messages',msg.guild.me.hasPermission('SEND_TTS_MESSAGES'), true)
					.addField('Embed Links',msg.guild.me.hasPermission('EMBED_LINKS'), true)
					.addField('Attach Files',msg.guild.me.hasPermission('ATTACH_FILES'), true)
					.addField('Read Message History',msg.guild.me.hasPermission('READ_MESSAGE_HISTORY'), true)
					.addField('Mention Everyone',msg.guild.me.hasPermission('MENTION_EVERYONE'), true)
					.addField('Create Insant Invite',msg.guild.me.hasPermission('CREATE_INSTANT_INVITE'), true)
					.addField('Mute Members',msg.guild.me.hasPermission('MUTE_MEMBERS'), true)
					.addField('Kick Members',msg.guild.me.hasPermission('KICK_MEMBERS'), true)
					.addField('Ban Members',msg.guild.me.hasPermission('BAN_MEMBERS'), true)
					.addField('Manage Channels',msg.guild.me.hasPermission('MANAGE_CHANNELS'), true)
					.addField('Manage Guild',msg.guild.me.hasPermission('MANAGE_GUILD'), true)
					.addField('Manage Webhooks',msg.guild.me.hasPermission('MANAGE_WEBHOOKS'), true)
					.addField('Connect',msg.guild.me.hasPermission('CONNECT'), true)
					.addField('Speak',msg.guild.me.hasPermission('SPEAK'), true)
					.addField('Deafen Members',msg.guild.me.hasPermission('DEAFEN_MEMBERS'), true)
					.addField('Move Members',msg.guild.me.hasPermission('MOVE_MEMBERS'), true)
					.addField('Use VAD',msg.guild.me.hasPermission('USE_VAD'), true)
					.addField('Change Nickname',msg.guild.me.hasPermission('CHANGE_NICKNAME'), true)
					.addField('Manage Nicknames',msg.guild.me.hasPermission('MANAGE_NICKNAMES'), true)
					.addField('Manage Roles',msg.guild.me.hasPermission('MANAGE_ROLES'), true);
				msg.author.send(embed);
				msg.delete();
				log.info(`${msg.author.tag} has listed permissions in ${msg.channel.guild}`);
				break;
			}
			case 'roles':{
				msg.author.send({embed:{
					title: `__Roles in: ${msg.channel.guild}__`,
					description: msg.guild.roles.map((m) => m.name).join(', '),
					color: '10724865'
				}});
				break;
			}
			default: {
				msg.reply('Correct syntax is: list ``perms`` | ``roles`` ');
			}
			}
		} else {
			msg.reply('You did not provide any arguments.');
		}
		
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Something went wrong while getting permissions: ${err}`);
	}
};