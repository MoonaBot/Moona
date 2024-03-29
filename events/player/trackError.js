const { EmbedBuilder } = require("discord.js");
const GLang = require("../../settings/models/Language.js");

module.exports = async (client, player, track, payload) => {

    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    if (!channel) return;

		const guildModel = await GLang.findOne({ guild: channel.guild.id });
		const { language } = guildModel;

    /////////// Update Music Setup ///////////

	  await client.UpdateMusic(player);
    await client.clearInterval(client.interval);

    /////////// Update Music Setup ///////////

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${client.i18n.get(language, "player", "error_desc")}`);

    channel.send({ embeds: [embed] });

    console.log('[DEBUG]', `Track Error in ${player.guildId} Auto-Leaved!`);
    if (!player.voiceChannel) player.destroy();

}