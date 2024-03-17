const MainClient = require("./Moona.js");
const client = new MainClient();

client.connect();

module.exports = client;

global.subText = (text="", length=0) => {
    return text.length > length ? text.substring(0, length-3)+"..." : text;
}
global.verifyTimestamp = (milisecond=0) => {
    return Math.round(milisecond / 1000);
}