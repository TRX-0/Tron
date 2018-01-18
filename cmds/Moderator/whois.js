exports.data = {
	name: 'Whois',
	description: 'Gets information about a user.',
	group: 'moderator',
	command: 'whois',
	syntax: 'whois [user mention]',
	author: 'Aris A.',
	permissions: 2,
	anywhere: false
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args) => {
	try{
		if (args[0]){
			var UserID = await msg.mentions.users.first().id;
			var UserStatus = await msg.mentions.users.first().presence.status;
			//var Game = await msg.mentions.users.first().presence.game.toString();
			var Username = await msg.mentions.users.first().username;
			var Avatar = await msg.mentions.users.first().avatarURL;
			var Discriminator = await msg.mentions.users.first().discriminator;
			msg.channel.send('', {embed: {
				thumbnail: {url: Avatar},
				author: {
					name: `Information about ${Username}#${Discriminator}`,
					icon_url: Avatar
				},
				color: 0xff8000 ,
				fields: [{
					name: 'User ID',
					value: UserID
				},
				{
					name: 'Username',
					value: Username
				},    
				{
					name: 'Status',
					value: UserStatus
				},               
				{
					name: 'Avatar Link',
					value: Avatar
				}
				],
			}});
		} else {
			msg.reply('You did not provide a @User.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author}, could not find user info: ${err}`);
	}
};
