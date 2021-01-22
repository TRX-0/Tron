exports.func = async (client, message) => {
    const log = require(`${client.config.folders.lib}/log.js`)('onMessage');
    try {
        const elevation = require(`${client.config.folders.functions}/elevation.js`);
        // Reject message if the message author is a bot or the message is not in a guild (eg. DMs)
        if (message.author.bot || !message.guild) return;
        // Find message's guild in the database
        const messageServer = await client.ServerModel.findOne({
            where: {
                guildId: message.guild.id
            }
        });
        let commandName, args;
        // Loop through possible prefixes to check if message is a command - this is a bit confusing because if the message is a command, then it is set to false (this is just so I could use .every())
        const prefixes = [messageServer.altPrefix, client.config.prefix,'<@398967169062535169>'];
        const isCommand = prefixes.every( prefix => {
            if (message.content.toLowerCase().startsWith(prefix)) {
                // Get the name of the command and it's arguments
                commandName = message.content.slice(prefix.length).trim().split(' ')[0];
                args = message.content.slice(prefix.length).trim().split(' ').slice(1);
                return false;
            } else {
                return true;
            }
        });
        if (isCommand) {
            if (message.content.toLowerCase().startsWith(':') && message.content.toLowerCase().endsWith(':')) {
                return emojis(message);
            }
            return updateUser(client, message, log);
        }
        if (commandName == '') {
            return message.reply('Yes?');
        }
        let command;
        // Check whether command exists as a file. (loaded in the commands collection)
        if (client.commands.has(commandName)) {
            // Fetch the command's prototype
            command = client.commands.get(commandName);
        } else {
            return message.reply('Command does not exist.');
        }
        //Check if command is registered in the database.
        const commandExists = await client.CommandModel.findOne({
            where: {
                guildId: message.guild.id,
                name: commandName
            }
        });
        //If it is disabled return.
        if (commandExists && commandExists.enabled == false) {
            return message.reply(`Command is disabled in ${message.guild.name}.`);
        }
        // Sometimes a message doesn't have a member object attached (idk either like wtf)
        if (!message.member) {
            message.member = message.guild.fetchMember(message);
        }
        // Get user's permission level
        const messageElevation = await elevation.func(client, message);
        if (messageElevation >= command.data.permissions) { // Check that the user exceeds the command's required elevation
            command.func(message, args, client); // Run the command's function
        } else {
            message.reply(':scream: You don\'t have permission to use this command.');
        }
    } catch (err) {
        log.error(`Something went wrong when handling a message: ${err}`);
    }
}

// Update User
async function updateUser(client, message, log) {
    //Check if user exists in db
    const userExists = await client.ProfilesModel.findOne({
        where: {
            guildId: message.guild.id,
            username: message.author.username
        }
    });
    //If user exists
    if (userExists) {
        //Get message count and add one more
        var UserCount = userExists.msgcount + 1;
        await userExists.update({
            msgcount: UserCount
        });
    } else {
        //Else create user entry in db
        await client.ProfilesModel.create({
            guildId: message.guild.id,
            username: message.author.username,
            discordid: message.author.id
        });
        log.info(`Created db entry for user ${message.author.username}.`);
    }
    return;
}

function emojis(message) {
    const log = require(`${message.client.config.folders.lib}/log.js`)('Emojis');
    if (message.content == ':yerts:') {
        message.channel.send('Damn it Yerts...', { files: ['https://i.imgur.com/1XpZHPe.gif'] });
        log.info(`${message.author.tag} used the Yerts emoji!`);
        message.delete();
    }
}