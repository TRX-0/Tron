exports.data = {
	name: 'Whois',
	description: 'Gets information about a user.',
	group: 'Moderator',
	command: 'whois',
	syntax: 'whois [user mention]',
	author: 'Aris A.',
	permissions: 1,
	anywhere: false
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Whois');
	try{
		if (args[0]){
			if (args[0].includes('@')){
				if (msg.mentions.users.first().id != null){
					//var Game = await msg.mentions.users.first().presence.game.toString();
					msg.channel.send('', {embed: {
						thumbnail: {url: msg.mentions.users.first().avatarURL},
						author: {
							name: `Information about ${msg.mentions.users.first().tag}`,
							icon_url: msg.mentions.users.first().avatarURL
						},
						color: 0xff8000 ,
						fields: [{
							name: 'User ID',
							value: msg.mentions.users.first().id
						},
						{
							name: 'Username',
							value: msg.mentions.users.first().username
						},    
						{
							name: 'Status',
							value: msg.mentions.users.first().presence.status
						},               
						{
							name: 'Avatar Link',
							value: msg.mentions.users.first().avatarURL
						}
						],
					}});
				} else {
					msg.channel.send('User does not exist.');
				}
			} else {
				const Users = await msg.guild.members;
				var Found = false;
				let User;
				await Users.forEach(user => {
					if ( (user.user.username.toLowerCase() == args[0].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase()))) {
						Found = true;
						User = user;
					}
				});
				if (Found == true) {
					msg.channel.send('', {embed: {
						thumbnail: {url: User.user.avatarURL},
						author: {
							name: `Information about ${User.user.tag}`,
							icon_url: User.user.avatarURL
						},
						color: 0xff8000 ,
						fields: [{
							name: 'User ID',
							value: User.user.id
						},
						{
							name: 'Username',
							value: User.user.username
						},    
						{
							name: 'Status',
							value: User.user.presence.status
						},               
						{
							name: 'Avatar Link',
							value: User.user.avatarURL
						}
						],
					}});
				} else {
					msg.channel.send('User does not exist.');
				}
			}
		} else {
			msg.reply('You did not provide a @User.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, could not find user info: ${err}`);
	}
};
