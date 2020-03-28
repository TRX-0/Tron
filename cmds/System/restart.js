exports.data = {
	name: 'Restart',
	command: 'restart',
	description: 'Restarts Bot.',
	group: 'System',
	syntax: 'restart',
	author: 'Aris A.',
	permissions: 4
};

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)(exports.data.name);
	const exec = require('util').promisify(require('child_process').exec);
	try {
		await msg.channel.send('Restarting all processes!');
		await exec(`cd ${bot.config.folders.home} && node main.js`);
		bot.destroy();
		process.exit();
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Error on bot restart: ${err}`);
	}
};
