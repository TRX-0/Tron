exports.data = {
	name: 'FlipCoin',
	description: 'Flips a coin.',
	group: 'fun',
	command: 'flipcoin',
	syntax: 'flipcoin',
	author: 'Aris A.',
	permissions: 2,
	anywhere: false
};

const log = require('../../lib/log.js')(exports.data.name);

exports.func = async (msg,args) => {
    try{
        const random = Math.random();
        switch (true) {
            case (random > 0.5):{
                msg.channel.send('', {embed: {
                    color: 835718,
                    fields: [
                        {
                          "name": "Flip Result",
                          "value": "Heads"
                        }
                      ]
                }});
                break;
            }
            case (random < 0.5): {
                msg.channel.send('', {embed: {
                    color: 835718,
                    fields: [
                        {
                          "name": "Flip Result",
                          "value": "Tails"
                        }
                      ]
                }});
                break;
            }
            default: {
                msg.channel.send('', {embed: {
                    color: 835718,
                    fields: [
                        {
                          "name": "Flip Result",
                          "value": "Your coin just landed straight up..."
                        }
                      ]
                }});
                break;
            }
        }
    } catch (err) {
        msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.username}#${msg.author.discriminator}, i could not flip a coin: ${err}`);
    }
};
