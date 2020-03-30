exports.data = {
	name: 'Purge',
	description: 'Removes messages from chat. Own/Mine removes Bot messages and Command Issuer messages respectively. Defaults to removing messages by everyone.',
	group: 'Moderator',
	command: 'purge',
	syntax: 'purge [optional:own/mine] [amount]',
	author: 'TRX',
	permissions: 3,
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		var deletedCount = 0;
		var msgArray = [];
		if (args[0] == undefined) {
			return msg.reply('No arguments specified.');
		}
		if (args[0].toLowerCase() == 'own') {
			const searchAmount = parseInt(args[1], 10);
			await msg.delete();
			if (!searchAmount || searchAmount < 2 || searchAmount > 100) {
				return msg.reply('Please provide a number between 2 and 100');
			}
			const fetched = await msg.channel.messages.fetch({ limit: searchAmount });
			await fetched.forEach(element => {
				if (element.author.id == msg.client.user.id) {
					msgArray.push(element);
					deletedCount++;
				}
			});
			msg.channel.bulkDelete(msgArray);
			msg.reply(`purged ${deletedCount} messages. `);
			log.info(`${msg.author.tag} deleted ${deletedCount} messages. `);
		} else if (args[0].toLowerCase() == 'mine') {
			const searchAmount = parseInt(args[1], 10);
			await msg.delete();
			if (!searchAmount || searchAmount < 2 || searchAmount > 100) {
				return msg.reply('Please provide a number between 2 and 100');
			}
			const fetched = await msg.channel.messages.fetch({ limit: searchAmount });
			await fetched.forEach(element => {
				if (element.author.id == msg.author.id) {
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
			await msg.delete();
			if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
				return msg.reply('Please provide a number between 2 and 100');
			}
			// So we get our messages, and delete them. Simple enough, right?
			const fetched = await msg.channel.messages.fetch({ limit: deleteCount });
			await msg.channel.bulkDelete(fetched);
			msg.reply(`deleted ${deleteCount} messages. `);
			log.info(`${msg.author.tag} purged ${deleteCount} messages. `);
		}
	} catch (err) {
		msg.reply(`${err.toString()}`);
		log.error(`${msg.author.tag} couldn't delete messages because of: ${err}`);
	}
};