/*
  When - inevitably - there is an unexpected whitespace update, run this file to reset the offending file
*/
const snek = require('snekfetch');
const jetpack = require('fs-jetpack');
const strftime = require('strftime');

const clean = str => {
	return str.replace(/<script[\s\S]*?>[\s\S]*?<\/script>|<link\b[^>]*>|Email:.+>|data-token=".+?"|email-protection#.+"|<div class="vc_row wpb_row vc_row-fluid no-margin parallax.+>|data-cfemail=".+?"|<!--[\s\S]*?-->/ig, '');
};

const data = jetpack.read('./watcherData.json', 'json');
const sites = Object.keys(data.wtSites.sites);
for (const site of sites) {
	const reqOpts = {headers: {}};
	if (site === 'https://wakingtitan.com') {
		reqOpts.headers.Cookie = 'terminal=%5B%22atlas%22%2C%22csd%22%2C%222fee0b5b-6312-492a-8308-e7eec4287495%22%2C%2205190fed-b606-4321-a52e-c1d1b39f2861%22%2C%22f7c05c4f-18a5-47a7-bd8e-804347a15f42%22%5D; archive=%5B%229b169d05-6b0b-49ea-96f7-957577793bef%22%2C%2267e3b625-39c0-4d4c-9241-e8ec0256b546%22%2C%224e153ce4-0fec-406f-aa90-6ea62e579369%22%2C%227b9bca5c-43ba-4854-b6b7-9fffcf9e2b45%22%2C%222f99ac82-fe56-43ab-baa6-0182fd0ed020%22%2C%22b4631d12-c218-4872-b414-9ac31b6c744e%22%2C%227b34f00f-51c3-4b6c-b250-53dbfaa303ef%22%2C%2283a383e2-f4fc-4d8d-905a-920057a562e7%22%2C%227ed354ba-b03d-4c56-ade9-3655aff45179%22%5D';
	}
	snek.get(site, reqOpts).then(req => { // Req.body is a buffer for unknown reasons
		const pageCont = clean(req.body.toString());
		const oldCont = clean(jetpack.read(`./watcherData/${data.wtSites.sites[site]}-latest.html`));
		if (pageCont.replace(/\s/g, '').replace(/>[\s]+</g, '><').replace(/"\s+\//g, '"/') !== oldCont.replace(/\s/g, '').replace(/>[\s]+</g, '><').replace(/"\s+\//g, '"/')) {
			setTimeout(() => {
				snek.get(site, reqOpts).then(req2 => {
					const pageCont2 = clean(req2.body.toString());
					if (pageCont2 === pageCont) {
						console.log('Change on ' + site);
						jetpack.write(`./watcherData/${data.wtSites.sites[site]}-latest.html`, req2.body.toString());
						jetpack.write(`./watcherData/${data.wtSites.sites[site]}-logs/${strftime('%F - %H-%M-%S')}.html`, req2.body.toString());
					}
				});
			}, 5000);
		}
	});
}

process.on('unhandledRejection', r => console.log(r));
