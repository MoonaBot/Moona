const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { execSync } = require("node:child_process");

module.exports = {
    name: ["shell"],
    description: "Running shell command",
    options: [{
        name: "command",
        description: "?",
        type: ApplicationCommandOptionType.String,
        required: true,
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
    run: async(interaction, client) => {
        await interaction.deferReply();
    let command = interaction.options.getString("command");
    if (!command) return interaction.message.react('❌');

    const embed = new EmbedBuilder().setColor("Green");

    try {
        const _execute = execSync(command);
        embed.setTitle(`$ __${command}__`)
        embed.setDescription(`\`\`\`shell\n${_execute}\`\`\``);

        interaction.editReply({ embeds: [embed] });
    }
    catch(error) {
        embed.setColor("Red");
        embed.setDescription(`Cannot running shell commands: $ ${command}\n\`${error.message}\``);

        interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    }
}