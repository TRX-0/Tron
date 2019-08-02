exports.data = {
	name: 'Eval',
	command: 'eval',
	description: 'Sends an eval',
	group: 'Utilities',
	syntax: 'eval [script]',
	author: 'Aris A.',
	permissions: 4
};

const fetch = require('node-fetch');

const clean = text => {
	if (typeof text === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	}
	return text;
};

exports.func = async (msg, args) => {
	const log = require(`${msg.client.config.folders.lib}/log.js`)('Eval');
	const key = msg.client.auth.pastebin.key;
	log.info(`(${msg.author.tag}) has used eval in #${msg.channel.name} on ${msg.guild.name}.`);
	const code = args.join(' ');
	try {
		let evaled = eval(code); // eslint-disable-line no-eval
		if (typeof evaled !== 'string') {
			evaled = require('util').inspect(evaled);
		}
		const params = {api_dev_key:key, api_option:'paste', api_paste_code:evaled, api_paste_private:0 , api_paste_name:'Eval', api_paste_format:'JavaScript', api_paste_expire_date:'10M'};
		if(evaled.length >= 2000) {
			fetch('https://pastebin.com/api/api_post.php' , { method: 'POST', body: params}).then(r => {
				//if(!body.body.key) {
				//	return msg.reply('Sorry, but I didn\'t receive a key from Hastebin.');
				//}
				return msg.reply(`Sorry, but your request was so big that I had to upload it: ${r.body}`);
			}).catch(() => msg.reply('Sorry, but an error happened with Hastebin!'));
		} else {
			await msg.channel.send('```xl\n' + clean(evaled) + '\n```',{split: {maxLength: 1950, char: 's'}}).catch(err => log.error(err));
		}
	} catch (err) {
		await msg.channel.send('`ERROR` ```xl\n' + clean(err) + '\n```').catch(err => log.error(err));
	}
};
