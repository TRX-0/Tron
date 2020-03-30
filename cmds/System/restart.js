exports.data = {
	name: 'Restart',
	command: 'restart',
	description: 'Restarts Bot.',
	group: 'System',
	syntax: 'restart',
	author: 'TRX',
	permissions: 4
};

exports.func = async (message, args, client) => {
	const log = require(`${client.config.folders.lib}/log.js`)(exports.data.name);
	const exec = require('util').promisify(require('child_process').exec);
	try {
		await message.channel.send('Restarting all processes!');
		await exec(`cd ${client.config.folders.home} && node main.js`);
		await client.destroy();
		await process.exit();
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Error on bot restart: ${err}`);
	}
};
