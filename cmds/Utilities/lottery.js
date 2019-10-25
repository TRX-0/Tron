exports.data = {
	name: 'Lottery',
	command: 'lottery',
	description: 'Pick random re-tweets',
	group: 'Utilities',
	syntax: 'lottery [tweet id] [amount]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Lottery');
	const auth = require ('../../auth.json');
	const Twit = require('twit');
	const T = new Twit(auth.twitter);
	if(args.length == 2){
		if (/^\d+$/.test(args[0]) && /^\d+$/.test(args[1])) {
			const id = args[0];
			const amount = args[1];
			try {
				let next = "";
				let first = true;
				do {
					if (first == true) {
						T.get('tweets/search/30day/Contest', { query: '200K HTB', maxResults: 100}, function(err, data, response) {
							console.log(data.next);
							console.log("==============================");
							console.log(data.user);
							if (data.next) {
								next = data.next;
							} else {
								next = "";
							}
						});
						first = false;
					} else {
						T.get('tweets/search/30day/Contest', { query: '200K HTB', maxResults: 100, next: next}, function(err, data, response) {
							console.log(next);
							console.log("==============");
							console.log(data);
							if (data.next) {
								next = data.next;
							} else {
								next = "";
							}
						});
					}

				} while (next != "");
			} catch (err) {
				msg.reply('Something went wrong.');
				log.error(`Error in the lottery function: ${err}`);
			}
		} else {
			msg.reply("Twit id and amount must be numerals.");
		}
	} else {
		msg.reply("Not enough arguments.");
	}
};
