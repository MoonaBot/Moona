const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { readdirSync } = require("fs");

const registerCategory = require("../../commands/config.js");

module.exports = {
    name: ["help"],
    description: "Display a list of commands",
    category: "General",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    options: [{
        name: "commands",
        description: "Enter the name of a specific commands",
        type: ApplicationCommandOptionType.String
    }],
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
    const query = interaction.options.getString("commands");
    const embed = new EmbedBuilder()
       .setColor(client.color)
       .setAuthor({ name: "Commands List", iconURL: interaction.user.displayAvatarURL({ forceStatic:true }) })
       .setDescription(`${client.i18n.get(language, "utilities", "help_desc", { prefix: "/", serverLink: 'https://discord.com' })}`)
    const buttons = [];

    if (!query) {
        const categories = readdirSync("./commands").filter(c => !c?.endsWith(".js")).filter(c => !registerCategory[c]?.private);
        embed.setFooter({ text: `Use the buttons below for specific commands information` });

        categories.forEach(category => {
        const commandList = 
            readdirSync(`./commands/${category}`).map(name => `\`${name.split(".")[0].toLowerCase()}\``);
        const ctg = registerCategory[category];
        category = `${ctg.name} [${client.commands.filter(cmd => cmd.category === category).size}]`;

        embed.addFields(
            { name: category, value: commandList.join(", ") }
        )
        buttons.push(
            new ButtonBuilder()
            .setCustomId(ctg.name)
            .setLabel(ctg.name)
            //.setEmoji(ctg.emoji)
            .setStyle(ButtonStyle.Primary)
        );
        });

        const action = new ActionRowBuilder().addComponents(...buttons);

        interaction.reply({ embeds: [embed], components: [action], fetchReply: true }).then(message => createButtonInteface(interaction, message, { buttons, embed, action, }));
        return;
    }
    else {
        const command = interaction.client.commands.find(x => x.name.includes(query));
        if (!command) {
        embed.setColor("Red")
        embed.setDescription(`Oh no! I don't find \`${query}\` commands.`)
        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }
        const ctg = registerCategory[command.category];
        embed.setAuthor({ name: command.name.at(-1) })
        .setDescription(command.description)
        .setFooter({ text: `Cooldown ${cdTime(command.cooldown || 3000)}` });

        interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
}
};

async function createButtonInteface(interaction, message, first) {
    const timeout = 1000 * 60 * 5;
    const filter = i => i.isButton() && i.user && i.message.author.id == interaction.client.user.id;
    const collector = await message.createMessageComponentCollector({ 
        filter,
        time: timeout,
    });

    var buttons = [
    new ButtonBuilder()
        .setCustomId("back")
        .setLabel("Back")
        .setStyle(ButtonStyle.Secondary),
    ...first.buttons,
    ];

    collector.on("collect", async i => {
    await i.deferUpdate();
    buttons = buttons.map(button => button.setDisabled(false));

    if (i.customId === "back") {
        await i.editReply({ embeds: [first.embed], components: [first.action] });
        return;
    }

    const commands = readdirSync(`./commands/${i.customId}`);
    const ctg = registerCategory[i.customId];

    const embed = new EmbedBuilder()
        .setColor(interaction.client.color)
        .setTitle(`${ctg.name} [${interaction.client.commands.filter(c=>c.category === i.customId).size}]`)
        .setDescription(ctg.description+"\n\n"+
        commands.map(name => `\`${name.split(".")[0].toLowerCase()}\` : ${require(process.cwd()+"/commands/"+name).description}.`).join("\n")
        )
        .setFooter({ text: `Available (${commands.size} Commands)` });

    buttons = buttons.map(
        button => {
        if (button.data.custom_id === i.customId) button.setDisabled(true);
        return button;
        }
    );
    const action = new ActionRowBuilder().addComponents(...buttons);

    await i.editReply({ embeds: [embed], components: [action] }).catch(_=> void 0);
    collector.resetTimer({ time: timeout });
    });

    collector.on("end", () => {
    if (!message) return;
    const buttons = first.buttons.map(button => button.setStyle(ButtonStyle.Secondary).setDisabled(true));
    const action = new ActionRowBuilder().addComponents(...buttons);

    message.edit({ embeds: [first.embed.setFooter({ text: `Button automatically disabled after inactive on 5 minutes.` })], components: [action] }).catch(o_O => void 0);
    });
}

function cdTime(ms) {
    let tipe;
    if (ms<1000*60) tipe = "seconds";
    if (ms>1000*60) tipe = "minutes";
    switch(tipe) {
        case "seconds": {
            return Math.round(ms/1000) + ' seconds';
        }
        case "minutes": {
            return Math.round(ms/1000) + ' minutes';
        }
    }
}
