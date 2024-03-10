const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { inspect } = require("node:util");

const djs = require("discord.js");
const util = require("node:util");

module.exports = {
    name: ["eval"],
    description: "Programming code evaluation",
    options: [{
        name: "code",
        description: "Program code value",
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    category: "Developer",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: (interaction, client, user, language) => {
    await interaction.deferReply({ content: 'Sedang diproses...' });

    let code = interaction.options.getString("code");
    if (!code) code = 'null';

    const embed = new EmbedBuilder().setColor("Blue");

    try {
        let evaled = await eval(code);
        evaled = clean(evaled);

        embed.setTitle("Response[Code]")
        embed.setDescription(`\`\`\`js\n${evaled}\`\`\``);

        await interaction.editReply({ content: null, embeds: [embed] });
    }
    catch(error) {
        embed.setColor("Red");
        embed.setTitle("Response[ERROR]")
        embed.setDescription(`\`\`\`js\n${clean(error)}\`\`\``);

        await interaction.editReply({ content: null, embeds: [embed] })
    }
    }
}

function clean(code) {
    if  (typeof code === "string") {
        return code
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
    }
    else {
        return inspect(code, { depth: 0 });
    }
};