const MainClient = require("./Kaori.js");
const client = new MainClient();

client.connect()

module.exports = client;

global.subText = (text="", length=0) => {
    return text.length > length ? text.substring(0, length-3)+"..." : text;
}