exports.data = {
	name: 'Time',
	command: 'time',
	description: 'Posts what the time is every hour.',
	group: 'Utilities',
	syntax: 'time [start/stop] [name]',
	author: 'Aris A.',
	permissions: 2
};

exports.func = (msg, args, bot) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Time');
	try{
		if (args[0]){
			if (args[0] == 'start'){
				var editable = msg.channel.send(`Current time is: \`\`\`${new Date()}\`\`\` or \`\`\`${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})}\`\`\` `);
				bot.schedule(editable.id, '* */1 * * * *');
				log.info(`${msg.author.tag} created a scheduler in ${msg.guild.name} on ${msg.channel.name}.`);
			} else if (args[0] == 'stop'){
				//j.cancel();
			} else {
				msg.reply('Wrong arguments');
			}
		} else {
			msg.reply('You did not provide any arguments you idiot!');
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Error on rot13 function due to: ${err}`);
	}
};
