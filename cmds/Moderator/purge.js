exports.data = {
	name: 'Purge',
	description: 'This command removes all messages from all users in the channel, up to 100.',
	group: 'Moderator',
	command: 'purge',
	syntax: 'purge [amount]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg,args) => {
	try{
		//Get the delete count, as an actual number.
		const deleteCount = parseInt(args[0], 10);
		if(!deleteCount || deleteCount < 2 || deleteCount > 100){
			return msg.reply('Please provide a number between 2 and 100');
		}
		// So we get our messages, and delete them. Simple enough, right?
		const fetched = await msg.channel.fetchMessages({limit: deleteCount});
		msg.channel.bulkDelete(fetched);
		log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) deleted ${deleteCount} messages. `);
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.username}#${msg.author.discriminator} Couldn't delete messages because of: ${err}`);
	}
};
