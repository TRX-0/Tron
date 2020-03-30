exports.data = {
	name: 'Color',
	command: 'color',
	description: 'Convert color values to and from Hex,NMS,RGB.',
	group: 'Utilities',
	syntax: 'color [NMS/RGB/HEX]',
	author: 'TRX',
	permissions: 2
};

function ConvertHex(givenColor){
	let RGB = [];
	RGB[0] = parseInt(givenColor.substr(0, 2), 16);
	RGB[1] = parseInt(givenColor.substr(2, 2),16);
	RGB[2] = parseInt(givenColor.substr(4,2),16);
	let NMS = [];
	NMS[0] = (RGB[0]/255).toFixed(6);
	NMS[1] = (RGB[1]/255).toFixed(6);
	NMS[2] = (RGB[2]/255).toFixed(6);
	for (var i=0; i < NMS.length; i++){
		if(NMS[i] == 0.000000){
			NMS[i] = 0;
		} else if (NMS[i] == 1.000000){
			NMS[i] = 1;
		}
	}
	return [RGB,NMS];
}

function ConvertRGB(givenColor){
	let HEX = [];
	HEX[0] = givenColor[0].toString(16);
	HEX[1] = givenColor[1].toString(16);
	HEX[2] = givenColor[2].toString(16);
	for (var i=0; i < HEX.length; i++){
		HEX[i] = HEX[i].length == 1 ? '0' + HEX[i] : HEX[i];
	}
	let NMS = [];
	NMS[0] = (givenColor[0]/255).toFixed(6);
	NMS[1] = (givenColor[1]/255).toFixed(6);
	NMS[2] = (givenColor[2]/255).toFixed(6);
	for (i=0; i < NMS.length; i++){
		if(NMS[i] == 0.000000){
			NMS[i] = 0;
		} else if (NMS[i] == 1.000000){
			NMS[i] = 1;
		}
	}
	return [HEX,NMS];
}

function ConvertNMS(givenColor){
	let RGB = [];
	RGB[0] = Math.round((parseFloat(givenColor[0])*255));
	RGB[1] = Math.round((parseFloat(givenColor[1])*255));
	RGB[2] = Math.round((parseFloat(givenColor[2])*255));
	let HEX = [];
	HEX[0] = RGB[0].toString(16);
	HEX[1] = RGB[1].toString(16);
	HEX[2] = RGB[2].toString(16);
	for (var i=0; i < HEX.length; i++){
		HEX[i] = HEX[i].length == 1 ? '0' + HEX[i] : HEX[i];
	}
	return [HEX,RGB];
}

exports.func = (message, args) => {
	const log = require(`${message.client.config.folders.lib}/log.js`)(exports.data.name);
	try{
		if((args.length == 1) && args[0]){
			if((args[0].match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/))|| (args[0].match(/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/))){
				let HEX;
				if (args[0].includes('#')){
					HEX = args[0].replace('#','');
				} else {
					HEX = args[0];
				}
				const Converted = ConvertHex(HEX);
				message.channel.send({
					embed:{
						color: parseInt(HEX, 16),
						title: `__Conversion of:  ${HEX.toUpperCase()}__`,
						url: `https://www.webpagefx.com/web-design/color-picker/${HEX}`,
						thumbnail: {
							url: `https://www.webpagefx.com/web-design/color-picker/${HEX}`
						},
						fields: [
							{
								name: 'RGB',
								value: `**${Converted[0][0]}**, **${Converted[0][1]}**, **${Converted[0][2]}**`,
								inline: true
							},
							{
								name: 'NMS',
								value: `**${Converted[1][0]}**, **${Converted[1][1]}**, **${Converted[1][2]}**`,
								inline: true
							}
						]
					}
				});
			} else {
				message.reply('Wrong HEX code.');
			}
		} else if (args && (args.length == 3)){
			if (args[0].length <= 3 && args[1].length <= 3 && args[2].length <= 3){
				for (var rgb in args){
					if (rgb.match('/[a-zA-Z.]/')){
						return message.reply('RGB value contains illegal characters.');
					}
				}
				const R = parseInt(args[0], 10);
				const G = parseInt(args[1], 10);
				const B = parseInt(args[2], 10);
				if (R > 255 || R < 0 || G > 255 || G < 0 || B > 255 || B < 0 ){
					return message.reply('RGB values are too big or too small.');
				}
				const Converted = ConvertRGB([R,G,B]);
				const HEX = Converted[0][0] + Converted[0][1] + Converted[0][2];
				message.channel.send({
					embed:{
						color: parseInt(HEX, 16),
						title: `__Conversion of:  ${R}, ${G}, ${B}__`,
						url: `https://www.webpagefx.com/web-design/color-picker/${HEX}`,
						thumbnail: {
							url: `https://www.webpagefx.com/web-design/color-picker/${HEX}`
						},
						fields: [
							{
								name: 'HEX',
								value: `**${HEX.toUpperCase()}**`,
								inline: true
							},
							{
								name: 'NMS',
								value: `**${Converted[1][0]}**, **${Converted[1][1]}**, **${Converted[1][2]}**`,
								inline: true
							}
						]
					}
				});
			} else if (args[0].length == 8 && args[1].length == 8 && args[2].length == 8){
				for (var i=0; i < args.length; i++){
					if (args[i].match(/[a-zA-Z]/)){
						return message.reply('NMS value contains illegal characters.');
					}
					if (!(args[i].match(/([0][.]){1}[0-9]{6}/) || args[i] == 1)){
						return message.reply('NMS color values are incorrect.');
					}
				}
				const Converted = ConvertNMS([args[0],args[1],args[2]]);
				const HEX = Converted[0][0] + Converted[0][1] + Converted[0][1];
				message.channel.send({
					embed:{
						color: parseInt(HEX, 16),
						title: `__Conversion of:  ${args[0]}, ${args[1]}, ${args[2]}__`,
						url: `https://www.webpagefx.com/web-design/color-picker/${HEX}`,
						thumbnail: {
							url: `https://www.webpagefx.com/web-design/color-picker/${HEX}`
						},
						fields: [
							{
								name: 'HEX',
								value: `**${HEX}**`,
								inline: true
							},
							{
								name: 'RGB',
								value: `**${Converted[1][0]}**, **${Converted[1][1]}**, **${Converted[1][2]}**`,
								inline: true
							}
						]
					}
				});
			} else {
				message.reply('Color values are incorrect.');
			}
		} else {
			message.reply('You did not provide any arguments.');
		}
	} catch (err){
		message.reply('Something went wrong.');
		log.error(`Sorry ${message.author.tag} unable to convert colors due to ${err}`);
	}
};
