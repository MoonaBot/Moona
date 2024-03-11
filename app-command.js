const { ApplicationCommandOptionType, REST, Routes, ApplicationCommandManager } = require('discord.js');
const { readdirSync } = require("node:fs");
const path = require('path');

const { TOKEN } = require("./settings/config.js");
const args = process.argv.slice(2);

const delay =  require("node:timers/promises").setTimeout;

(async () => {

  let commands = [];

  let cleared = args[0] == "guild" ? args[2] == "clear" : (args[0] == "global" ? args[1] == "clear" : false);
  let deployed = args[0] == "guild" ? "guild" : args[0] == "global" ? "global" : null;

  if (!deployed) {
    console.error(`Invalid sharing mode! Valid modes: guild, global`);
    console.info(`Usage (example): node app-command.js guild <guildId> [clear]`);
    console.info(`Usage (example): node app-command.js global [clear]`);
    return process.exit(1);
  }

  if (!cleared) {
    const folder = path.resolve("commands");
    let store = [];

    readdirSync(folder)
        .filter(i => {
            return !i.endsWith(".js");
        })
        .forEach((directory) => {
            const files = readdirSync(`${folder}/${directory}`);
            for (const file of files) {
                const command = require(`${folder}/${directory}/${file}`);
                //console.log(`Interaction "${command.type == "CHAT_INPUT" ? `/${command.name.join(" ")}` : `${command.name[0]}`}" ${command.name[1] || ""} ${command.name[2] || ""} added to the transform list!`);
                store.push(command);
            }
        });
    await delay(5000);

    store = store.sort((a, b) => a.name.length - b.name.length)

    commands = store.reduce((all, current) => {
      switch (current.name.length) {
        case 1: {
          all.push({
            type: current.type,
            name: current.name[0],
            description: current.description,
            defaultPermission: current.defaultPermission,
            options: current.options
          });
          break;
        }
        case 2: {
          let baseItem = all.find((i) => {
            return i.name == current.name[0] && i.type == current.type
          });
          if (!baseItem) {
            all.push({
              type: current.type,
              name: current.name[0],
              description: `${current.name[0]} commands.`,
              defaultPermission: current.defaultPermission,
              options: [
                {
                  type: ApplicationCommandOptionType.Subcommand,
                  description: current.description,
                  name: current.name[1],
                  options: current.options
                }
              ]
            });
          } else {
            baseItem.options.push({
              type: ApplicationCommandOptionType.Subcommand,
              description: current.description,
              name: current.name[1],
              options: current.options
            })
          }
          break;
        }
        case 3: {
          let SubItem = all.find((i) => {
            return i.name == current.name[0] && i.type == current.type
          });
          if (!SubItem) {
            all.push({
              type: current.type,
              name: current.name[0],
              description: `${current.name[0]} commands.`,
              defaultPermission: current.defaultPermission,
              options: [
                {
                  type: ApplicationCommandOptionType.SubcommandGroup,
                  description: `${current.name[1]} commands.`,
                  name: current.name[1],
                  options: [
                    {
                      type: ApplicationCommandOptionType.Subcommand,
                      description: current.description,
                      name: current.name[2],
                      options: current.options
                    }
                  ]
                }
              ]
            });
          } else {
            let GroupItem = SubItem.options.find(i => {
              return i.name == current.name[1] && i.type == ApplicationCommandOptionType.SubcommandGroup
            });
            if (!GroupItem) {
              SubItem.options.push({
                type: ApplicationCommandOptionType.SubcommandGroup,
                description: `${current.name[1]} commands.`,
                name: current.name[1],
                options: [
                  {
                    type: ApplicationCommandOptionType.Subcommand,
                    description: current.description,
                    name: current.name[2],
                    options: current.options
                  }
                ]
              })
            } else {
              GroupItem.options.push({
                type: ApplicationCommandOptionType.Subcommand,
                description: current.description,
                name: current.name[2],
                options: current.options
              })
            }
          }
        }
          break;
      }

      return all;
    }, []);
    
    commands = commands.map(i => ApplicationCommandManager.transformCommand(i));
  } else {
    console.info("No interactions read, all existing ones will be cleared...");
  }

  const rest = new REST({ version: 10 }).setToken(TOKEN);
  const client = await rest.get(Routes.user());
  console.info(`Account information received! ${client.username}#${client.discriminator} (${client.id})`);

  console.info(`Interactions are posted on discord!`);
  switch (deployed) {
    case "guild": {
      let guildId = args[1];
      console.info(`Deploy mode: guild (${guildId})`);

      await rest.put(Routes.applicationGuildCommands(client.id, guildId), { body: commands }).catch(console.info);

      console.info(`Shared commands may take 3-5 seconds to arrive.`);
      break;
    }
    case "global": {
      console.info(`Deploy mode: global`);

      await rest.put(Routes.applicationCommands(client.id), { body: commands }).catch(console.info);

      console.info(`Shared commands can take up to 1 hour to arrive. If you want it to come immediately, you can throw your bot from your server and get it back.`);
      break;
    }
  }

  console.info(`Interactions shared!`);
})();
