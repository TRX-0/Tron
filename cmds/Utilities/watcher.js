exports.data = {
	name: 'Watcher',
	command: 'watcher',
	description: 'Watcher functions',
	group: 'Utilities',
	syntax: 'watcher [start|stop|enable|disable|list] [watcherName] [params]',
	author: 'Matt C',
	permissions: 3,
};

const jetpack = require('fs-jetpack');

exports.func = async (message, args, client) => {
	const log = require(`${client.config.folders.lib}/log.js`)(exports.data.name);
	let watcher;
	
	try {
		if (!args[0]) {
			return message.reply(`You haven't provided enough arguments. The proper syntax for "${this.data.name}" is ${this.data.syntax}.`);
		}
		if (args[1]) {
			watcher = await client.WatcherModel.findOne({
				where: {
					watcherName: args[1]
				}
			});
		}
		
		switch (args[0]) {
		case 'start':
		{
			if (watcher) {
				client.watchers.get(args[1]).start(message, client, args.slice(2));
			} else {
				message.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'stop':
		{
			if (watcher) {
				client.watchers.get(args[1]).stop(message, client, args.slice(2));
			} else {
				message.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'enable':
		{
			if (watcher || jetpack.list(`${client.config.folders.watchers}`).includes(`${args[1]}.js`)) {
				if (!watcher) {
					watcher = await client.WatcherModel.create({
						watcherName: args[1],
						globalEnable: true,
						disabledGuilds: []
					});
				}
				if (watcher.globalEnable) {
					message.reply('Enable failed: watcher already enabled.');
				} else {
					client.watcherEnable(args[1], watcher);
					message.reply('Enable successful.');
					log.info(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) has enabled ${watcher.watcherName}.`);
				}
			} else {
				message.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'disable':
		{
			if (watcher) {
				if (watcher.globalEnable) {
					client.watcherDisable(args[1], watcher);
					message.reply('Disable successful.');
					log.info(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) has disabled ${watcher.watcherName}.`);
				} else {
					message.reply('Disable failed: watcher already disabled.');
				}
			} else {
				message.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'reload':
		{
			if (watcher) {
				if (watcher.globalEnable) {
					client.watcherReload(args[1]);
					message.reply('Reload successful.');
					log.info(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) has reloaded ${watcher.watcherName}.`);
				} else {
					message.reply('Reload failed: watcher already disabled.');
				}
			} else {
				message.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'list':
		{
			if (watcher) {
				client.watchers.get(args[1]).list(message, client, args.slice(2));
			} else if (args[1]) {
				message.reply('Selected watcher does not exist.');
			} else {
				const watcherList = (await client.WatcherModel.findAll()).map(w => {
					return w.watcherName;
				}).join(', ');
				message.reply(`Available watchers are \`${watcherList}\`.`);
				log.info(`${message.member.displayName} (${message.author.username}#${message.author.discriminator}) has listed the available watchers in #${message.channel.name} on ${message.guild.name}.`);
			}
			break;
		}
		default:
		{
			message.reply('Invalid watcher command.');
			break;
		}
		}
	} catch (err) {
		message.reply('Something went wrong.');
		log.error(`Error in the watcher function: ${err}`);
	}
};
