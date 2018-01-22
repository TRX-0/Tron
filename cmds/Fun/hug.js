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
			await msg.delete();
			await msg.channel.send(`${msg.mentions.users.first()} here is a hug to feel better! `, {embed: {
				color: 0xff8000 ,
				image: {
					url :'https://media.giphy.com/media/3M4NpbLCTxBqU/giphy.gif'
				}
			}});
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag}, i could not hug due to: ${err}`);
	}
};
