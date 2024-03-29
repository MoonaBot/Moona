const { EmbedBuilder } = require("discord.js");
const formatDuration = require("../../utils/FormatDuration.js");
const GLang = require("../../settings/models/Language.js");
const Setup = require("../../settings/models/Setup.js");
  
module.exports = async (client) => {
    client.updateMessage = async function(player, message, _="default") {
        if (!player[player.guildId]) player[player.guildId] = {};
        const oldMessage = player[player.guildId][_];
        if (oldMessage) {
            const targetMessage = oldMessage.channel.messages.cache.get(oldMessage.id);
            if (targetMessage) {
                await targetMessage.delete();
            }
        }
        return (player[player.guildId][_] = message);
    }

    client.UpdateQueueMsg = async function (player) {
        const database = await Setup.findOne({ guild: player.guildId });
        if (database.enable === false) return;

        const channel = await client.channels.cache.get(database.channel);
        if (!channel) return;

        const msg = channel.messages.cache(database.playmsg);
        if (!msg) return;
    
        const guildModel = await GLang.findOne({ guild: player.guildId });
        const { language } = guildModel;

        const songStrings = [];
        const queuedSongs = player.queue.map((song, i) => `${client.i18n.get(language, "setup", "setup_content_queue", {
            index: i + 1,
            title: song.title,
            duration: formatDuration(song.duration),
            request: song.requester.tag,
        })}`);

        songStrings.push(...queuedSongs);

        const Str = songStrings.slice(0, 10).join('\n');

        const cSong = player.current;
        const qDuration = `${formatDuration(player.queue.duration)}`;

        const played = player.playing ? `${client.i18n.get(language, "setup", "setup_nowplay")}` : `${client.i18n.get(language, "setup", "setup_songpause")}`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${played}`, iconURL: `${client.i18n.get(language, "setup", "setup_author_icon")}` })
            .setDescription(`${client.i18n.get(language, "setup", "setup_desc", {
                title: cSong.title,
                url: cSong.url,
                duration: formatDuration(cSong.duration),
                request: cSong.requester,
            })}`) // [${cSong.title}](${cSong.url}) \`[${formatDuration(cSong.duration)}]\` • ${cSong.requester}
            .setColor(client.color)
            .setFooter({ text: `${client.i18n.get(language, "setup", "setup_footer", {
                songs: player.queue.length,
                volume: player.volume,
                duration: qDuration,
            })}` }) //${player.queue.length} • Song's in Queue | Volume • ${player.volume}% | ${qDuration} • Total Duration

            if(cSong.artworkUrl) {
                embed.setImage(`https://i3.ytimg.com/vi/${cSong.identifier}/maxresdefault.jpg`);
            } else {
                embed.setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`);
            }

        return msg.edit({ 
            content: `${client.i18n.get(language, "setup", "setup_content")}\n${Str == '' ? `${client.i18n.get(language, "setup", "setup_content_empty")}` : '\n' + Str}`, 
            embeds: [embed], 
            components: [client.enSwitch] 
        }).catch((e) => {});
    };

    client.UpdateMusic = async function (player) {
        const database = await Setup.findOne({ guild: player.guildId });
        if (database.enable === false) return;

        const channel = await client.channels.cache.get(database.channel);
        if (!channel) return;

        const msg = channel.messages.cache.get(database.playmsg);
        if (!msg) return;
    
        const guildModel = await GLang.findOne({ guild: player.guildId });
        const { language } = guildModel;

        const queueMsg = `${client.i18n.get(language, "setup", "setup_queuemsg")}`;

        const playEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `${client.i18n.get(language, "setup", "setup_playembed_author")}` })
          .setImage(`${client.i18n.get(language, "setup", "setup_playembed_image")}`)
          .setDescription(`${client.i18n.get(language, "setup", "setup_playembed_desc", {
              clientId: client.user.id,
          })}`)
          .setFooter({ text: `${client.i18n.get(language, "setup", "setup_playembed_footer", {
            prefix: "/"
          })}` });

        return msg.edit({ 
            content: `${queueMsg}`, 
            embeds: [playEmbed], 
            components: [client.diSwitch] 
        }).catch((e) => {});
    };
};