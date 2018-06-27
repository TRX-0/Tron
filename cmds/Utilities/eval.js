exports.data = {
	name: 'Eval',
	command: 'eval',
	description: 'Sends an eval',
	group: 'Utilities',
	syntax: 'eval [script]',
	author: 'Matt C: matt@artemisbot.uk',
	permissions: 4
};

const snekfetch = require('snekfetch');

const clean = text => {
	if (typeof text === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	}
	return text;
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Eval');
	log.info(`${msg.member.displayName} (${msg.author.username}#${msg.author.discriminator}) has used eval in #${msg.channel.name} on ${msg.guild.name}.`);
	const code = args.join(' ');
	try {
		let evaled = eval(code); // eslint-disable-line no-eval
		if (typeof evaled !== 'string') {
			evaled = require('util').inspect(evaled);
		}
		if(evaled.length >= 2000) {
			snekfetch.post('https://hastebin.com/documents').send(evaled).then(body => {
				if(!body.body.key) {
					return msg.reply('Sorry, but I didn\'t receive a key from Hastebin.');
				}
				return msg.reply(`Sorry, but your request was so big that I had to upload it: https://hastebin.com/${body.body.key}`);
			}).catch(() => msg.reply('Sorry, but an error happened with Hastebin!'));
		} else {
			await msg.channel.send('```xl\n' + clean(evaled) + '\n```',{split: {maxLength: 1950, char: 's'}}).catch(err => log.error(err));
		}
	} catch (err) {
		await msg.channel.send('`ERROR` ```xl\n' + clean(err) + '\n```').catch(err => log.error(err));
	}
};
