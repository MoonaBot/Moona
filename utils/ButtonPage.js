const {
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

exports.execute = async (
    raw,
    pages,
    timeout = 60000*3
) => {
    if (!raw || !pages) throw new Error(raw ? "(options#pages) ?" : "(options:raw) ?");

    let page = 0;

    const _b = raw.client.button.pages;

    const buttons = [
        new ButtonBuilder()
            .setCustomId('page_back')
            .setEmoji(_b.back.emoji)
            .setStyle(_b.back.style),
        new ButtonBuilder()
            .setCustomId('page_next')
            .setEmoji(_b.next.emoji)
            .setStyle(_b.next.style),
    ];
    const row = new ActionRowBuilder().addComponents(buttons);

  //has the raw already been deferred? If not, defer the reply.
    if (raw.deferred == false) {
        await raw.deferReply();
    }

    const curPage = await raw.editReply({
        embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
        components: [row]
    });

    const filter = i => {
        if (i.user.id !== raw.user.id) {
            return i.reply({ content: `Sorry, you cannot use this buttons!`, ephemeral: true });
        } else {
            return true;
        }
    };

    const collector = await curPage.createMessageComponentCollector({
        filter,
        time: timeout,
    });

    collector.on("collect", async (i) => {
        if (!i.deferred) await i.deferUpdate();
        switch (i.customId) {
            case buttons[0].data.custom_id:
            page = page > 0 ? --page : pages.length - 1;
            break;
            case buttons[1].data.custom_id:
            page = page + 1 < pages.length ? ++page : 0;
            break;
            default:
            break;
        }

        await curPage.edit({
            embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
            components: [row],
        });
        collector.resetTimer();
    });

    collector.on("end", (_, reason) => {
        if (reason !== "messageDelete") {
            buttons.forEach((button, i=0) => buttons[i++].setDisabled(true));
            curPage.edit({
                embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
                components: [new ActionRowBuilder().addComponents(buttons)],
            });
        }
  });

  return curPage;
};
