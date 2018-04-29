exports.data = {
	name: 'IRC',
	command: 'irc',
	description: 'Connect to IRC chat.',
	group: 'System',
	syntax: 'irc',
	permissions: 4
};

const exec = require('util').promisify(require('child_process').exec);

exports.func = async (msg) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('IRC');
	try {
		const response = await exec('irssi');
		msg.channel.send(response);
		process.exit();
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};