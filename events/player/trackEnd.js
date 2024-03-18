module.exports = async (client, player, track, playload) => {

    await client.clearInterval(client.interval);

    const autoplay = player.get("autoplay")
    if (autoplay === true) {
        const requester = player.get("requester");
        const identifier = player.current.identifier;
        const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
        let res = await player.search({ query: search, requester });
        try {
            await player.queue.add(res.tracks[1]);
        } catch (e) {
            ///
        }
    }
}