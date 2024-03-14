const { readdirSync, resolve } = require("node:fs");
const { GlobalFonts } = require("@napi-rs/canvas");

module.exports = async (client) => {
    readdirSync('./assets/fonts')
        .forEach(name => {
            GlobalFonts.registerFromPath(resolve(`assets/fonts/${name}`), (name.split('.')[0]));
        });
    //console.log(white('[') + green('INFO') + white('] ') + green('Fonts ') + white('Handlers') + green(' Loaded!'));
};