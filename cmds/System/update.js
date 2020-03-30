exports.data = {
	name: 'Update',
	command: 'update',
	description: 'Update tron code.',
	group: 'System',
	syntax: 'update',
	author: 'TRX',
	permissions: 4
};

const exec = require('util').promisify(require('child_process').exec);

exports.func = async (message) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		const sent = await message.channel.send('Updating code...');
		//const response = await exec(`cd ${message.client.config.folders.home} && git pull https://${message.client.auth.Github.Username}:${message.client.auth.Github.Password}@github.com/TRX-0/Tron.git`);
		const response = await exec(`cd ${message.client.config.folders.home} && git pull`);
		if(response.stdout.toString().includes('Already up-to-date.') || response.stdout.toString().includes('Already up to date.')){
			await sent.edit('The code is already up to date!');
			return;
		} else {
			await sent.edit(`Code has been updated!\`\`\`\n${response.stdout}\n\`\`\``);
		}
		if(response.stdout.toString('utf8').includes('package.json')) {
			const senttwo = await message.channel.send('BUT WAIT, THERE IS MORE... package.json update detected! Launching NPM...');
			const npm = await exec('npm install');
			await senttwo.edit(`New packages and updates have been installed!\`\`\`\n${npm.stdout}\n\`\`\``);
		}
		process.exit();
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};