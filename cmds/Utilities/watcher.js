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

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)(exports.data.name);
	await bot.Watcher.sync();
	let watcher = await bot.Watcher.findOne({
		where: {
			watcherName: args[1]
		}
	});
	try {
		if (!args[0]) {
			return msg.reply(`You haven't provided enough arguments. The proper syntax for "${this.data.name}" is \`${this.data.syntax}\`.`);
		}
		switch (args[0]) {
		case 'start':
		{
			if (watcher) {
				bot.watchers.get(args[1]).start(msg, bot, args.slice(2));
			} else {
				msg.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'stop':
		{
			if (watcher) {
				bot.watchers.get(args[1]).stop(msg, bot, args.slice(2));
			} else {
				msg.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'enable':
		{
			if (watcher || jetpack.list(`${bot.config.folders.watchers}`).includes(`${args[1]}.js`)) {
				if (!watcher) {
					watcher = await bot.Watcher.create({
						watcherName: args[1],
						globalEnable: true,
						disabledGuilds: []
					});
				}
				if (watcher.globalEnable) {
					msg.reply('Enable failed: watcher already enabled.');
				} else {
					bot.watcherEnable(args[1], watcher);
					msg.reply('Enable successful.');
					log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has enabled ${watcher.watcherName}.`);
				}
			} else {
				msg.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'disable':
		{
			if (watcher) {
				if (watcher.globalEnable) {
					bot.watcherDisable(args[1], watcher);
					msg.reply('Disable successful.');
					log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has disabled ${watcher.watcherName}.`);
				} else {
					msg.reply('Disable failed: watcher already disabled.');
				}
			} else {
				msg.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'reload':
		{
			if (watcher) {
				if (watcher.globalEnable) {
					bot.watcherReload(args[1]);
					msg.reply('Reload successful.');
					log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has reloaded ${watcher.watcherName}.`);
				} else {
					msg.reply('Reload failed: watcher already disabled.');
				}
			} else {
				msg.reply('Selected watcher does not exist.');
			}
			break;
		}
		case 'list':
		{
			if (watcher) {
				bot.watchers.get(args[1]).list(msg, bot, args.slice(2));
			} else if (args[1]) {
				msg.reply('Selected watcher does not exist.');
			} else {
				const watcherList = (await bot.Watcher.all()).map(w => {
					return w.watcherName;
				}).join(', ');
				msg.reply(`Available watchers are \`${watcherList}\`.`);
				log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has listed the available watchers in #${msg.channel.name} on ${msg.guild.name}.`);
			}
			break;
		}
		default:
		{
			msg.reply('Invalid watcher command.');
			break;
		}
		}
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Error in the watcher function: ${err}`);
	}
};
