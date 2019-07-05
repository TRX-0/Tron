exports.func = async (name, msg) => {
	let Member;
	if(name.includes('@')){
		Member = msg.mentions.members.first();
	} else {
		const Users = await msg.guild.members;
		var Found = false;
		await Users.forEach(user => {
			if ( (user.user.username.toLowerCase() == name.toLowerCase()) || ( user.nickname && (user.nickname.toLowerCase() == name.toLowerCase()))) {
				Found = true;
				Member = user;
			}
		});
		if (Found) {
			return Member;
		} else {
			return null;
		}
	}
};