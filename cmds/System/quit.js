exports.data = {
	name: 'Quit',
	command: 'quit',
	description: 'Rage Quits. If dockerized you need to set restart=never to docker-compose.yml for this command to work.',
	group: 'System',
	syntax: 'quit',
	author: 'TRX',
	permissions: 4
};

exports.func = async (message, args, client) => {
	const log = require(`${client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		await message.channel.send('Stopping all processes and exiting!');
		client.destroy();
		process.exit();
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Error on bot quit: ${err}`);
	}
};
