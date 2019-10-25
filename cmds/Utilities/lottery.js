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
                data = T.get('tweets/search/30day/Contest', {
                    query: '200K HTB',
                    maxResults: 100,
                    next: nextPage
                }).catch(function (err) {
                    console.log('caught error', err.stack)
                }).then(function (result) {
                    // `result` is an Object with keys "data" and "resp".
                    // `data` and `resp` are the same objects as the ones passed
                    // to the callback.
                    // See https://github.com/ttezel/twit#tgetpath-params-callback
                    // for details.

                    //console.log('data', result.data);
                    return result.data;
                })
                /*
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
                }); */
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
