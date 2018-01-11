exports.data = {
	name: 'Enable Command',
	command: 'enable',
	description: 'Enables a new/disabled command.',
	syntax: 'enable [command]',
	group: 'system',
	author: 'Matt C: matt@artemisbot.uk',
	permissions: 3,
	anywhere: false
};

const log = require('../../lib/log.js')(exports.data.name);

exports.func = async (msg, args, bot) => {
	try {
		if (!args[0]){ // Check that user has provided arguments
			msg.reply('You did not provide any arguments.');
		} else {
			if (bot.commands.has(args[0])) { // Check if provided argument corresponds to an existing command
				const m = await msg.channel.send(`Enabling: ${args[0]}`);
				await bot.enable(args[0]);
				await m.edit(`Successfully enabled: ${args[0]}`);
				log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has enabled ${args[0]} in #${msg.channel.name} on ${msg.guild.name}.`);
			} else {
				msg.reply('Specified command does not exist.');
			}
		}
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
