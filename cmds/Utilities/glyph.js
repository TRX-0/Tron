exports.data = {
	name: 'Glyph',
	command: 'glyph',
	description: 'Translate glyphs from and to hex.',
	group: 'fun',
	syntax: 'glyph [encrypt/decrypt] [hex/glyph emojis]',
	author: 'Aris A.',
	permissions: 2
};
const config = require('../../config.json');
const log = require(`${config.folders.lib}/log.js`)(exports.data.name);

async function Validate(Hex){
	var PortalCode = Hex[0];
	var SystemID = Hex[1] + Hex[2] + Hex[3];
	var Height = Hex[5] + Hex [6];
	var Width = Hex[7] + Hex[8] + Hex[9];
	var Length = Hex[10] + Hex[11] + Hex[12];
	if (SystemID == '079'){

	}
	if (SystemID == '07A'){
		
	}
}
exports.func = async (msg, args, bot) => {
	try{
		const ValidHex = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
		switch(args[0]) {
		case 'encode': 
		{
			const ValidGlyphs = ['401737040133226517','401737942223028244','401737944488083456','401737946799276033','401738178958065666','401738216744419328','401738245056102401','401738279684145153','401738309627281408','401738340119871498','401738367575785472','401738401323155456','401738438946062336','401738473268051968','401738516163330050','401738545808801812'];
			if (args[1].length == 12){
				var GivenHex = args[1].split('');
				for (var i=0; i < args[1].length; i++){
					if (!(ValidHex.includes(GivenHex[i]))){
						msg.reply('Wrong portal address.');
						return;
					}
				}
				var Encoded = '';
				for (var i=0; i < args[1].length; i++){
					Encoded = Encoded + msg.guild.emojis.get(ValidGlyphs[ValidHex.indexOf(GivenHex[i])]);
				}
				msg.channel.send({
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
				msg.reply('Wrong address length.');
			}
			break;
		}
		case 'decode':
		{
			//If glyphs have spaces between them
			const ValidGlyphs = ['<:p0:401737040133226517>','<:p1:401737942223028244>','<:p2:401737944488083456>','<:p3:401737946799276033>','<:p4:401738178958065666>','<:p5:401738216744419328>','<:p6:401738245056102401>','<:p7:401738279684145153>','<:p8:401738309627281408>','<:p9:401738340119871498>','<:pA:401738367575785472>','<:pB:401738401323155456>','<:pC:401738438946062336>','<:pD:401738473268051968>','<:pE:401738516163330050>','<:pF:401738545808801812>'];
			if (args[1].length == 24){
				for (var i=1; i <= 12; i++){
					if (!(ValidGlyphs.includes(args[i]))){
						msg.reply('Wrong portal address.');
						return;
					}
				}
				var Decoded = '';
				for (var i=1; i <= 12; i++){
					Decoded = Decoded + ValidHex[ValidGlyphs.indexOf(args[i])];
				}
				msg.channel.send({
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
					
				for (var i=0; i <= 11; i++){
					GivenGlyphs[i] = GivenGlyphs[i] + '>';
					if (!(ValidGlyphs.includes(GivenGlyphs[i]))){
						msg.reply('Wrong portal address.');
						return;
					}
				}
				var Decoded = '';
				for (var i=0; i <= 11; i++){
					Decoded = Decoded + ValidHex[ValidGlyphs.indexOf(GivenGlyphs[i])];
				}
				msg.channel.send({
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
				msg.reply('Wrong address length.');
			}
			break;
		}
		default:
		{
			msg.reply('Invalid arguments.');
			break;
		}
		}
	} catch (err){
		msg.reply('Something went wrong.');
		log.error(`Sorry ${msg.author.tag} unable to translate portals due to ${err}`);
	}
};
