exports.data = {
	name: 'Update',
	command: 'update',
	description: 'Update tron code.',
	group: 'system',
	syntax: 'update',
	author: 'Aris A.',
	permissions: 4
};

const moment = require('moment');
const config = require('../../config.json');
const exec = require("util").promisify(require("child_process").exec);
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Server = require(`${config.folders.models}/server.js`);

exports.func = async (msg,args) => {
	try {
		const sent = await msg.send("Updating code...");
        const responsed = await exec(`git pull https://${authDetails.github.user}:${authDetails.github.password}@github.com/imurx/sweetiebot-klasa.git`);
        if(responsed.stdout.toString("utf8").includes("Already up-to-date.")) return sent.edit("The code is already up-to-date!");
        await sent.edit(`Code has been updated!\`\`\`\n${responsed.stdout}\n\`\`\``);
        if(responsed.stdout.toString("utf8").includes("package.json")) {
            const senttwo = await msg.channel.send("BUT WAIT, THERE IS MORE... package.json update detected! Launching NPM...");
            const npm = await exec("npm install");
            await senttwo.edit(`New packages and updates have been installed!\`\`\`\n${npm.stdout}\n\`\`\``);
        }
        await this.client.economyDB.close();
        await this.client.myDBisCool.close();
        process.exit();
	} catch (err) {
		log.error(`Something went wrong: ${err}`);
	}
};
