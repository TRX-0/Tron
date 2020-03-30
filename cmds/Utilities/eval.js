exports.data = {
	name: 'Eval',
	command: 'eval',
	description: 'Sends an eval',
	group: 'Utilities',
	syntax: 'eval [script]',
	author: 'TRX',
	permissions: 5
};

const fetch = require('node-fetch');

const clean = text => {
	if (typeof text === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	}
	return text;
};

exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	const key = message.client.auth.pastebin.key;
	log.info(`(${message.author.tag}) has used eval in #${message.channel.name} on ${message.guild.name}.`);
	const code = args.join(' ');
	try {
		let evaled = eval(code); // eslint-disable-line no-eval
		if (typeof evaled !== 'string') {
			evaled = require('util').inspect(evaled);
		}
		const params = `api_dev_key=${key}&api_option=paste&api_paste_code=${evaled}&api_paste_private=0&api_paste_name=Eval&api_paste_format=JavaScript&api_paste_expire_date=10M`;
		//const data = `api_dev_key=${key}&api_option=paste&api_paste_code=testeronios`;
		if(evaled.length >= 2000) {
			fetch('https://pastebin.com/api/api_post.php' , {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: params}).then(async r => {
				var response = await r.text();
				if(response.includes("Bad API request")) {
					return message.reply(`Sorry, but there was an error with the Pastebin API: ${response}.`);
				}
				return message.reply(`Sorry, but your request was so big that I had to upload it: ${response}`);
			}).catch(err => message.reply(`Sorry, but an error happened with Pastebin: ${err}`));
		} else {
			await message.channel.send('```xl\n' + clean(evaled) + '\n```',{split: {maxLength: 1950, char: 's'}}).catch(err => log.error(err));
		}
	} catch (err) {
		await message.channel.send('`ERROR` ```xl\n' + clean(err) + '\n```').catch(err => log.error(err));
	}
};
