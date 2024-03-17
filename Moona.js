const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { MoonlinkManager } = require("erela.js");
const { I18n } = require("@hammerhq/localization");

process.on('unhandledRejection', error => console.info(error));
process.on('uncaughtException', error => console.info(error));

class MainClient extends Client {
	 constructor() {
        super({
            //shards: "auto",
            allowedMentions: { parse: ["users", "roles"] },
            intents: [
                GatewayIntentBits.Guilds,
                //GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                //GatewayIntentBits.MessageContent,
            ]
        });
        this.on("error", console.info);
        this.on("warn", console.info);

    this.config = require("./settings/config.js");
    this.button = require("./settings/button.js");
    this.owner = this.config.OwnerId;
    this.dev = this.config.Developers;
    this.color = this.config.ClientColor;
    this.i18n = new I18n(this.config.Language);
    if(!this.token) this.token = this.config.Token;

    const client = this;

    this.moon = new MoonlinkManager(
        this.config.LavalinkNodes,
		{
		    // options
		},
		(guildId, payload) => {
			const guild = client.guilds.cache.get(guildId);
			if (guild) guild.shard.send(JSON.parse(payload));
		},
    );

    ["commands", "premiums"].forEach(x => client[x] = new Collection());
    require("node:fs")
        .readdirSync('./handlers')
        .filter(_ => _.endsWith(".js"))
        .forEach(x => require(`./handlers/${x}`)(client));

	}
	connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;