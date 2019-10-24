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
	const id = args[1];
	const number = args[2];
	try {
		//var Tweets = await T.get('statuses/retweeters/ids',{id: id,count:100,cursor:-1});
		//msg.channel.send(Tweets);
		console.log(id);
		console.log(number);
		T.get('statuses/retweeters/ids', { id: id, count: 100, cursor:-1 }, function(err, data, response) {
			console.log(data)
		})
	} catch (err) {
		msg.reply('Something went wrong.');
		log.error(`Error in the watcher function: ${err}`);
	}
};
