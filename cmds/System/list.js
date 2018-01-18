exports.data = {
	name: 'List',
	command: 'list',
	description: 'List permissions and roles.',
	group: 'system',
	syntax: 'list [perms/roles]',
	author: 'Aris A,',
	permissions: 3
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args,bot) => {
	try {
		if (args[0]){
			switch (args[0]){
			case 'perms':{
				msg.channel.send({
					embed: {
						'fields': [
							{
								name: 'Create Insant Invite',
								value: ('CREATE_INSTANT_INVITE'),
								inline: true
							},
							{
								name: 'Kick Members',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Ban Members',
								value: '1',
								inline: true
							},
							{
								name: 'Administrator',
								value: 'are inline fields',
								inline: true
							},      
							{
								name: 'Manage Channels',
								value: '1',
								inline: true
							},
							{
								name: 'Manage Guild',
								value: 'are inline fields',
								inline: true
							},      
							{
								name: 'Add Reactions',
								value: '1',
								inline: true
							},
							{
								name: 'Send TTS Messages',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Read Messages',
								value: '1',
								inline: true
							},
							{
								name: 'Send Messages',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Manage Messages',
								value: '1',
								inline: true
							},
							{
								name: 'Embed Links',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Attach Files',
								value: '1',
								inline: true
							},
							{
								name: 'Read Message History',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Mention Everyone',
								value: '1',
								inline: true
							},
							{
								name: 'Manage Webhooks',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Connect',
								value: '1',
								inline: true
							},
							{
								name: 'Speak',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Mute Members',
								value: '1',
								inline: true
							},
							{
								name: 'Deafen Members',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Move Members',
								value: '1',
								inline: true
							},
							{
								name: 'Use VAD',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Change Nickname',
								value: '1',
								inline: true
							},
							{
								name: 'Manage Nicknames',
								value: 'are inline fields',
								inline: true
							},
							{
								name: 'Manage Roles or Permissions',
								value: '1',
								inline: true
							}
						]
					}
				});
				break;
			}
			case 'roles':{

				break;
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