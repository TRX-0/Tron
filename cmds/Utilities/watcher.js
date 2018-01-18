exports.data = {
	name: 'Watchers',
	command: 'watcher',
	description: 'Watcher functions',
	group: 'fun',
	syntax: 'watcher [start|stop|enable|disable|list] [watcherName] [params]',
	author: 'Matt C: matt@artemisbot.uk',
	permissions: 3,
	anywhere: true
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);
const Watcher = require(`${config.folders.models}/watcher`);
const jetpack = require('fs-jetpack');

exports.func = async (msg, args, bot) => {
	await Watcher.sync();
	let watcher = await Watcher.findOne({
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
						if (watcher.disabledGuilds.includes(msg.guild.id)) {
							msg.reply(`This watcher has been disabled in this guild. Re-enable it with \` watcher genable ${args[1]}\`.`);
						} else {
							bot.watchers.get(args[1]).start(msg, bot, args.slice(2));
						}
					} else {
						msg.reply('Selected watcher does not exist.');
					}
					break;
				}
			case 'stop':
				{
					if (watcher) {
						if (watcher.disabledGuilds.includes(msg.guild.id)) {
							msg.reply(`This watcher has been disabled in this guild. Re-enable it with \` watcher genable ${args[1]}\`.`);
						} else {
							bot.watchers.get(args[1]).stop(msg, bot, args.slice(2));
						}
					} else {
						msg.reply('Selected watcher does not exist.');
					}
					break;
				}
			case 'enable':
				{
					if (watcher || jetpack.list(`${config.folders.watchers}`).includes(`${args[1]}.js`)) {
						if (!watcher) {
							watcher = await Watcher.create({
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
			case 'genable':
				{
					if (watcher) {
						if (watcher.disabledGuilds.includes(msg.guild.id)) {
							watcher.disabledGuilds.splice(watcher.disabledGuilds.indexOf(msg.guild.id), 1);
							await watcher.update({
								disabledGuilds: watcher.disabledGuilds
							});
							msg.reply('Watcher enabled for this guild.');
							log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has enabled ${watcher.watcherName} for ${msg.guild.name}.`);
						} else {
							msg.reply('Enable failed: watcher already enabled for this guild.');
						}
					} else {
						msg.reply('Selected watcher does not exist.');
					}
					break;
				}
			case 'gdisable':
				{
					if (watcher) {
						if (watcher.disabledGuilds.includes(msg.guild.id)) {
							msg.reply('Disable failed: watcher already disabled for this guild.');
						} else {
							watcher.disabledGuilds.push(msg.guild.id);
							await watcher.update({
								disabledGuilds: watcher.disabledGuilds
							});
							msg.reply('Watcher disabled for this guild.');
							log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has disabled ${watcher.watcherName} for ${msg.guild.name}.`);
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
						if (watcher.disabledGuilds.includes(msg.guild.id)) {
							msg.reply(`This watcher has been disabled in this guild. Re-enable it with \`ocel watcher genable ${args[1]}\`.`);
						} else {
							bot.watchers.get(args[1]).list(msg, bot, args.slice(2));
						}
					} else if (args[1]) {
						msg.reply('Selected watcher does not exist.');
					} else {
						const watcherList = (await Watcher.all()).map(w => {
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
