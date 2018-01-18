exports.data = {
	name: 'Say',
	description: 'Makes Tron say something.',
	group: 'fun',
	command: 'say',
	syntax: 'say [message]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args) => {
	try{
		if (args[0]){
			const sayMessage = args.join(' ');
			//We delete the command message (sneaky, right?).
			msg.delete(); 
			// And we get the bot to say the thing: 
			msg.channel.send(sayMessage);
			log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) made Tron talk. `);
		} else {
			msg.reply('You did not provide any arguments.');
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.username}#${msg.author.discriminator}, i could not speak due to: ${err}`);
	}
};
