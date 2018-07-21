exports.data = {
	name: 'Hug',
	description: 'Hugs specified user.',
	group: 'Fun',
	command: 'hug',
	syntax: 'hug [@user]',
	author: 'Aris A.',
	permissions: 2,
	anywhere: false
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Hug');
	try{
		if (args[0]){
			let User;
			if (args[0].includes('@')){
				User = msg.mentions.members.first();
			} else {
				const Users = await msg.guild.members;
				await Users.forEach(user => {
					if ( (user.user.username.toLowerCase() == args[0].toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == args[0].toLowerCase()))) {
						User = user;
					}
				});
			}
			if (User != null) {
				await msg.delete();
				await msg.channel.send(`${User} here is a hug to feel better! `, {embed: {
					color: 0xff8000 ,
					image: {
						url :'https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif'
					}
				}});
			} else {
				msg.channel.send('User does not exist.');
			}
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not hug due to: ${err}`);
	}
};
