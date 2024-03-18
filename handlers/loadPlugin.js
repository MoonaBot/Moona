const { MoonlinkNode, Structure } = require('moonlink.js');
const YouTubeMusic = require("ytmusic-api").default;

const { request } = require('undici');

module.exports = async (client) => {
    client.ytm = new YouTubeMusic();
    await client.ytm.initialize();

Structure.extend(
    'MoonlinkNode',
    class MoonaNode {
        constructor() {
            this.version = this.getVersion() || null;
        }
        async getVersion() {
            const { body } = await request(
                `${this.secure?"https://":"http://"}${this.host}/version`,
                { headers: { Authorization: this.password } }
            );
            return await body.text().catch(_ => '0.0.0');
        }
    }
);
    //console.log(white('[') + green('INFO') + white('] ') + green('Plugin ') + white('Handlers') + green(' Loaded!'));
};