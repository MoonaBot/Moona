const YouTubeMusic = require("ytmusic-api");
const ytm = new YouTubeMusic();

const { white, green } = require("chalk");

module.exports = async () => {
    await ytm.initialize();
    //console.log(white('[') + green('INFO') + white('] ') + green('Plugin ') + white('Handlers') + green(' Loaded!'));
};