exports.data = {
	name: 'Purge',
	description: 'Removes messages from chat.Own removes bot messages, mine removes command author messages, else removes messages by everyone. Own and Mine use a search index instead of a count.',
	group: 'Moderator',
	command: 'purge',
	syntax: 'purge [optional:own/mine] [amount/search index]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

exports.func = async (msg,args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Purge');
	try{
		var deletedCount = 0;
		var msgArray = [];
		if(args[0].toLowerCase() == 'own'){
			const searchAmount = parseInt(args[1], 10);
			msg.delete();
			if(!searchAmount || searchAmount < 2 || searchAmount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			const fetched = await msg.channel.fetchMessages({limit: searchAmount});
			await fetched.forEach(element => {
				if(element.author.id == msg.client.user.id){
					msgArray.push(element);
					deletedCount++;
				}
			});
			msg.channel.bulkDelete(msgArray);
			msg.reply(`purged ${deletedCount} messages. `);
			log.info(`${msg.author.tag} deleted ${deletedCount} messages. `);
		} else if (args[0].toLowerCase() == 'mine'){
			const searchAmount = parseInt(args[1], 10);
			if(!searchAmount || searchAmount < 2 || searchAmount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			const fetched = await msg.channel.fetchMessages({limit: searchAmount});
			await fetched.forEach(element => {
				if(element.author.id == msg.author.id){
					msgArray.push(element);
					deletedCount++;
				}
			});
			msg.channel.bulkDelete(msgArray);
			msg.reply(`deleted ${deletedCount} messages. `);
			log.info(`${msg.author.tag} purged ${deletedCount} messages. `);
		} else {
			//Get the delete count, as an actual number.
			const deleteCount = parseInt(args[0], 10);
			if(!deleteCount || deleteCount < 2 || deleteCount > 100){
				return msg.reply('Please provide a number between 2 and 100');
			}
			// So we get our messages, and delete them. Simple enough, right?
			const fetched = await msg.channel.fetchMessages({limit: deleteCount});
			await msg.channel.bulkDelete(fetched);
			msg.reply(`deleted ${deleteCount} messages. `);
			log.info(`${msg.author.tag} purged ${deleteCount} messages. `);
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} Couldn't delete messages because of: ${err}`);
	}
};