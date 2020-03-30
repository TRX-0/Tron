exports.func = (client, message) => {
	const log = require(`${client.config.folders.lib}/log.js`)('Elevation');
	return new Promise(async (resolve, reject) => {
		try {
			const user = message.author; // If there is a user object, this is the user we care about, otherwise, just message author
			const member = await message.guild.members.fetch(user.id);
			//const impMember = user ? await message.guild.fetchMember(user.id) : message.member; // If we care about the user object, we have no member object - fetch it


			if (user.id === client.auth.ownerID) { // If the author's ID is the same as the client owner's then give them top perms
				return resolve(5);
			}
			const server = await client.ServerModel.findOne({ // Fetch server object
				where: {
					guildId: message.guild.id
				}
			});
			const isAdmin = await client.ProfilesModel.findOne({
				where:{
					discordid: user.id
				}
			});
			if (isAdmin && isAdmin.admin == true) { // If user is an admin in the server
				return resolve(4);
			}

			server.perm3.forEach(id => { // Loop through level 3 permissions for the server, check user against them
				if (member.roles.cache.has(id)) {
					return resolve(3);
				}
			});
			server.perm2.forEach(id => { // Loop through level 2 permissions for the server, check user against them
				if (member.roles.cache.has(id)) {
					return resolve(2);
				}
			});
			server.perm1.forEach(id => { // Loop through level 1 permissions for the server, check user against them
				if (member.roles.cache.has(id)) {
					return resolve(1);
				}
			});
			return resolve(0); // Otherwise nothing
		} catch (err) {
			log.error(`Error on message evelvation: ${err}`);
			reject(err);
		}
	});
};