exports.data = {
	name: 'Kick',
	description: 'Kick a specific user.',
	group: 'moderator',
	command: 'kick',
	syntax: 'kick [name] [reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

exports.func = async (msg, args, bot) => {
    try{
        if (args[0]){          
            let member = msg.mentions.members.first();
            if(!member){
                return msg.reply("Please mention a valid member of this server");
            }
            if(!member.kickable){ 
                return msg.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
            }
            let reason = args.slice(1).join(' ');
            if(!reason){
                return msg.reply("Please indicate a reason for the kick!");
            }
            await member.kick(reason);
            msg.reply(`${member.user.tag} has been kicked by ${msg.author.tag} Reason: ${reason}`);
        } else {
            msg.reply('You did not provide a name to kick.');
        }
    } catch (err) {
        msg.reply('Something went wrong.');
		log.error(`Sorry ${message.author} I couldn't kick because of : ${error}`);
    }
};
