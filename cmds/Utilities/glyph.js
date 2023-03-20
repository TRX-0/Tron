exports.data = {
	name: 'Glyph',
	command: 'glyph',
	description: 'Translate glyphs from and to hex.',
	group: 'Utilities',
	syntax: 'glyph [encode/decode] [hex/glyph emojis]',
	author: 'TRX',
	permissions: 2
};

/*async function Validate(Hex){
	var PortalCode = Hex[0];
	var SystemID = Hex[1] + Hex[2] + Hex[3];
	var Height = Hex[5] + Hex [6];
	var Width = Hex[7] + Hex[8] + Hex[9];
	var Length = Hex[10] + Hex[11] + Hex[12];
	if (SystemID == '079'){

	}
	if (SystemID == '07A'){
		
	}
}*/
exports.func = async (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		const ValidHex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
		var i=0;
		switch(args[0]) {
		case 'encode': 
		{
			//const ValidGlyphs = ['401737040133226517','401737942223028244','401737944488083456','401737946799276033','401738178958065666','401738216744419328','401738245056102401','401738279684145153','401738309627281408','401738340119871498','401738367575785472','401738401323155456','401738438946062336','401738473268051968','401738516163330050','401738545808801812'];
			const ValidGlyphs = ['<:p0:401737040133226517>',':p1:401737942223028244',':p2:401737944488083456',':p3:401737946799276033',':p4:401738178958065666',':p5:401738216744419328',':p6:401738245056102401',':p7:401738279684145153',':p8:401738309627281408',':p9:401738340119871498',':pA:401738367575785472',':pB:401738401323155456',':pC:401738438946062336',':pD:401738473268051968',':pE:401738516163330050',':pF:401738545808801812'];
			if (args[1].length == 12){
				var GivenHex = args[1].split('');
				for (i=0; i < args[1].length; i++){
					if (!(ValidHex.includes(GivenHex[i]))){
						message.reply('Wrong portal address.');
						return;
					}
				}
				var Encoded = '';
				for (i=0; i < args[1].length; i++){
					//Encoded = Encoded + message.guild.emojis.resolveID(ValidGlyphs[ValidHex.indexOf(GivenHex[i])]);
					Encoded = Encoded + ValidGlyphs[ValidHex.indexOf(GivenHex[i])];
				}
				message.channel.send({
					embed:{
						fields:[
							{
								name: 'Encoded Address',
								value: Encoded
							}
						]
					}
				});
			} else {
				message.reply('Wrong address length.');
			}
			break;
		}
		case 'decode':
		{
			const ValidGlyphs = ['<:p0:401737040133226517>','<:p1:401737942223028244>','<:p2:401737944488083456>','<:p3:401737946799276033>','<:p4:401738178958065666>','<:p5:401738216744419328>','<:p6:401738245056102401>','<:p7:401738279684145153>','<:p8:401738309627281408>','<:p9:401738340119871498>','<:pA:401738367575785472>','<:pB:401738401323155456>','<:pC:401738438946062336>','<:pD:401738473268051968>','<:pE:401738516163330050>','<:pF:401738545808801812>'];
			var Decoded = '';
			//If glyphs have spaces between them
			if (args[1].length == 24){
				for (i=1; i <= 12; i++){
					if (!(ValidGlyphs.includes(args[i]))){
						message.reply('Wrong portal address.');
						return;
					}
				}
				
				for (i=1; i <= 12; i++){
					Decoded = Decoded + ValidHex[ValidGlyphs.indexOf(args[i])];
				}
				message.channel.send({
					embed:{
						fields:[
							{
								name: 'Decoded Address',
								value: Decoded
							}
						]
					}
				});
			//If glyphs are stuck together
			} else if (args[1].length == 288){
				var GivenGlyphs = args[1].split('>');
					
				for (i=0; i <= 11; i++){
					GivenGlyphs[i] = GivenGlyphs[i] + '>';
					if (!(ValidGlyphs.includes(GivenGlyphs[i]))){
						message.reply('Wrong portal address.');
						return;
					}
				}
				for (i=0; i <= 11; i++){
					Decoded = Decoded + ValidHex[ValidGlyphs.indexOf(GivenGlyphs[i])];
				}
				message.channel.send({
					embed:{
						fields:[
							{
								name: 'Decoded Address',
								value: Decoded
							}
						]
					}
				});

			} else {
				message.reply('Wrong address length.');
			}
			break;
		}
		default:
		{
			message.reply('Invalid arguments.');
			break;
		}
		}
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} unable to translate portals due to ${err}`);
	}
};
