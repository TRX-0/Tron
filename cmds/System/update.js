exports.data = {
	name: 'Update',
	command: 'update',
	description: 'Update tron code.',
	group: 'System',
	syntax: 'update',
	permissions: 4
};

const exec = require('util').promisify(require('child_process').exec);

exports.func = async (msg) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)(exports.data.name);
	try {
		const sent = await msg.channel.send('Updating code...');
		//const response = await exec(`cd ${msg.client.config.folders.home} && git pull https://${msg.client.auth.Github.Username}:${msg.client.auth.Github.Password}@github.com/TRX-0/Tron.git`);
		const response = await exec(`cd ${msg.client.config.folders.home} && git pull`);
		if(response.stdout.toString().includes('Already up-to-date.') || response.stdout.toString().includes('Already up to date.')){
			await sent.edit('The code is already up to date!');
			return;
		} else {
			await sent.edit(`Code has been updated!\`\`\`\n${response.stdout}\n\`\`\``);
		}
		if(response.stdout.toString('utf8').includes('package.json')) {
			const senttwo = await msg.channel.send('BUT WAIT, THERE IS MORE... package.json update detected! Launching NPM...');
			const npm = await exec('npm install');
			await senttwo.edit(`New packages and updates have been installed!\`\`\`\n${npm.stdout}\n\`\`\``);
		}
		process.exit();
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};