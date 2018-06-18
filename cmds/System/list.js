exports.data = {
	name: 'List',
	command: 'list',
	description: 'List bot permissions and roles.',
	group: 'System',
	syntax: 'list [perms/roles]',
	author: 'Aris A,',
	permissions: 4
};

exports.func = (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('List');
	try {
		if (args[0]){
			switch (args[0]){
			case 'perms':{
				msg.author.send({
					embed: {
						title: `__Bot Permissions in: ${msg.channel.guild}__`,
						color: '10724865',
						fields: [
							{
								name: 'Administrator',
								value: msg.guild.me.hasPermission('ADMINISTRATOR'),
								inline: true
							},
							{
								name: 'Send Messages',
								value: msg.guild.me.hasPermission('SEND_MESSAGES'),
								inline: true
							},
							{
								name: 'Manage Messages',
								value: msg.guild.me.hasPermission('MANAGE_MESSAGES'),
								inline: true
							},
							{
								name: 'Send TTS Messages',
								value: msg.guild.me.hasPermission('SEND_TTS_MESSAGES'),
								inline: true
							},
							{
								name: 'Embed Links',
								value: msg.guild.me.hasPermission('EMBED_LINKS'),
								inline: true
							},
							{
								name: 'Attach Files',
								value: msg.guild.me.hasPermission('ATTACH_FILES'),
								inline: true
							},
							{
								name: 'Read Message History',
								value: msg.guild.me.hasPermission('READ_MESSAGE_HISTORY'),
								inline: true
							},
							{
								name: 'Mention Everyone',
								value: msg.guild.me.hasPermission('MENTION_EVERYONE'),
								inline: true
							},
							{
								name: 'Create Insant Invite',
								value: msg.guild.me.hasPermission('CREATE_INSTANT_INVITE'),
								inline: true
							},
							{
								name: 'Mute Members',
								value: msg.guild.me.hasPermission('MUTE_MEMBERS'),
								inline: true
							},
							{
								name: 'Kick Members',
								value: msg.guild.me.hasPermission('KICK_MEMBERS'),
								inline: true
							},
							{
								name: 'Ban Members',
								value: msg.guild.me.hasPermission('BAN_MEMBERS'),
								inline: true
							},
							{
								name: 'Manage Channels',
								value: msg.guild.me.hasPermission('MANAGE_CHANNELS'),
								inline: true
							},
							{
								name: 'Manage Guild',
								value: msg.guild.me.hasPermission('MANAGE_GUILD'),
								inline: true
							},
							{
								name: 'Manage Webhooks',
								value: msg.guild.me.hasPermission('MANAGE_WEBHOOKS'),
								inline: true
							}, 
							{
								name: 'Add Reactions',
								value: msg.guild.me.hasPermission('ADD_REACTIONS'),
								inline: true
							},
							{
								name: 'Connect',
								value: msg.guild.me.hasPermission('CONNECT'),
								inline: true
							},
							{
								name: 'Speak',
								value: msg.guild.me.hasPermission('SPEAK'),
								inline: true
							},
							{
								name: 'Deafen Members',
								value: msg.guild.me.hasPermission('DEAFEN_MEMBERS'),
								inline: true
							},
							{
								name: 'Move Members',
								value: msg.guild.me.hasPermission('MOVE_MEMBERS'),
								inline: true
							},
							{
								name: 'Use VAD',
								value: msg.guild.me.hasPermission('USE_VAD'),
								inline: true
							},
							{
								name: 'Change Nickname',
								value: msg.guild.me.hasPermission('CHANGE_NICKNAME'),
								inline: true
							},
							{
								name: 'Manage Nicknames',
								value: msg.guild.me.hasPermission('MANAGE_NICKNAMES'),
								inline: true
							},
							{
								name: 'Manage Roles',
								value: msg.guild.me.hasPermission('MANAGE_ROLES'),
								inline: true
							}
						]
					}
				});
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
				msg.reply('Wrong arguments.');
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