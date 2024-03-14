const { readdirSync, readFileSync } = require("node:fs");
const Canvas = require("canvas-constructor/napi-rs");

module.exports = async (client) => {
    readdirSync('./assets/fonts')
        .forEach(name => {
            Canvas.registerFont(readFileSync(`./assets/fonts/${name}`), (name.split['.'][0]).split("-").join(' '))
        });
    //console.log(white('[') + green('INFO') + white('] ') + green('Fonts ') + white('Handlers') + green(' Loaded!'));
};