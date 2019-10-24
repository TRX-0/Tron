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
				let next = -1;
				do {
					T.get('statuses/retweeters/ids', { id: id, count: 100, cursor: next }, function(err, data, response) {
						console.log(next);
						console.log("==============");
						console.log(data);
						console.log(response);
						next = data.next_cursor;
					});
				} while (next != 0 && next != '0');
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
