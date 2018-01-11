exports.data = {
	name: 'Ban',
	description: 'Bans a specific user.',
	group: 'moderator',
	command: 'ban',
	syntax: 'ban [name] [reason]',
	author: 'Aris A.',
	permissions: 3,
	anywhere: false
};

const log = require('../../lib/log.js')(exports.data.name);

exports.func = async (msg, args, bot) => {
    try{
        if (args[0]){          
            let member = msg.mentions.members.first();
            if(!member){
                return msg.reply("Please mention a valid member of this server");
            }
            if(!member.bannable){ 
                return msg.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
            }
            let reason = args.slice(1).join(' ');
            if(!reason){
                return msg.reply("Please indicate a reason for the ban!");
            }
            await member.ban(reason);
            msg.reply(`${member.user.tag} has been banned by ${msg.author.tag} Reason: ${reason}`);
        } else {
            msg.reply('You did not provide a name to ban.');
        }
    } catch (err) {
        msg.reply('Something went wrong.');
		log.error(`Sorry ${message.author} I couldn't ban because of : ${error}`);
    }
};
