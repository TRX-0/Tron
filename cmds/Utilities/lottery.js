exports.data = {
    name: 'Lottery',
    command: 'lottery',
    description: 'Pick random re-tweets',
    group: 'Utilities',
    syntax: 'lottery [query]',
    author: 'Aris A.',
    permissions: 3,
};

exports.func = async (msg, args, bot) => {
    const log = require(`${bot.config.folders.lib}/log.js`)('Lottery');
    const auth = require('../../auth.json');
    const Twit = require('twit');
    const T = new Twit(auth.twitter);
    if (args.length == 1) {
        const q = args[0];
        try {
            let nextPage = "";
            //let first = true;
			let data;
            do {
                /*if (first == true) {
                    await T.get('tweets/search/30day/Contest', {
                        query: '200K HTB',
                        maxResults: 100
                    }, async function (err, data, response) {
						if (data.next) {
							nextPage = await data.next;
						}
						console.log(nextPage);
						console.log("==============================");
						console.log(data.results.length);
                    });
                    first = false;
                } else {*/
                	//console.log("Got here");
                    data = await T.get('tweets/search/30day/Contest', {
                        query: '200K HTB',
                        maxResults: 100,
                        next: nextPage
                    }, function (err, data, response) {
						if (data.next) {
							nextPage = data.next;
						} else {
							nextPage = "";
						}
						console.log(nextPage);
						console.log("==============================");
						console.log(data.results.length);
						return data;
                    });
                    console.log(data.result.length);
                //}
            } while (nextPage !== "");
        } catch (err) {
            msg.reply('Something went wrong.');
            log.error(`Error in the lottery function: ${err}`);
        }
    } else {
        msg.reply("Not enough arguments.");
    }
};
