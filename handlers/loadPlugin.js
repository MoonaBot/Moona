const YouTubeMusic = require("ytmusic-api").default;

const { white, green } = require("chalk");

module.exports = async (client) => {
    client.ytm = new YouTubeMusic();
    await client.ytm.initialize();
    //console.log(white('[') + green('INFO') + white('] ') + green('Plugin ') + white('Handlers') + green(' Loaded!'));
};