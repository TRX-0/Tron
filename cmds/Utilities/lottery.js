exports.data = {
	name: 'Lottery',
	command: 'lottery',
	description: 'Pick random re-tweets',
	group: 'Utilities',
	syntax: 'lottery [tweet id] [number]',
	author: 'Aris A.',
	permissions: 3,
};

exports.func = async (msg, args, bot) => {
	const log = require(`${bot.config.folders.lib}/log.js`)('Watcher');
	const auth = require ('../../auth.json');
	const Twit = require('twit');
	const T = new Twit(auth.twitter);
	const id = args[0];
	const number = args[1];
	try {
		//var Tweets = await T.get('statuses/retweeters/ids',{id: id,count:100,cursor:-1});
		//msg.channel.send(Tweets);
		let next = -1;
		do {
			let data = T.get('statuses/retweeters/ids', { id: id, count: 100, cursor: next }, function(err, data, response) {
				return data;
			});
			console.log("WHAAAAT" + data.next_cursor);
			next = data.next_cursor;
		} while (data.next_cursor > 0);
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Error in the watcher function: ${err}`);
	}
};
