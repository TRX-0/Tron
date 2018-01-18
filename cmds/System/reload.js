exports.data = {
	name: 'Reload Command',
	command: 'reload',
	description: 'Reloads a command.',
	group: 'system',
	syntax: 'reload [command]',
	author: 'Aris A.',
	permissions: 4,
	anywhere: true
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg, args, bot) => {
	try {
		if (!args[0]){ // Check that user has provided arguments
			msg.reply('You did not provide any arguments.');
		} else {
			if (bot.commands.has(args[0])) { // Check if provided argument corresponds to an existing command
				const m = await msg.channel.send(`Reloading: ${args[0]}`);
				await bot.reload(args[0]);
				await m.edit(`Successfully reloaded: ${args[0]}`);
				log.info(`${msg.author.tag} has reloaded ${args[0]} on ${msg.guild.name}.`);
			} else {
				msg.reply('Specified command does not exist.');
			}
		}
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
