const { readdirSync } = require("node:fs");
const { green, white } = require('chalk');
const path = require("path");

module.exports = async (client) => {
    const folder = path.resolve("commands");

    readdirSync(folder)
        .filter(d => !d.endsWith(".js"))
        .forEach((directory) => {
            const start = Date.now();
            const files = readdirSync(`${folder}/${directory}`);
            //   console.log(`[INFO] Loading interaction at.. "${directory}"`)

            for (const file of files) {
                const command = require(`${folder}/${directory}/${file}`);
                client.commands.set(command.name, command);
                //console.log(`[INFO] "${command.type == "CHAT_INPUT" ? `/${command.name.join(" ")}` : `${command.name[0]}`}" ${command.name[1] || ""}  ${command.name[2] || ""} The interaction has been uploaded. (it took ${Date.now() - start}ms)`);
            }
        });

    if (client.commands.size) {
        //console.log(white('[') + green('INFO') + white('] ') + green(`${client.commands.size} `) + white('Interactions') + green(' Loaded!'));
    } else {
        console.log(`[WARN] No interactions loaded, is everything ok?`);
    }
}