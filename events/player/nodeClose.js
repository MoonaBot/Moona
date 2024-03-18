module.exports = async (client, node, code, reason) => {
	console.log('[WARN]', `Lavalink Node ${node.host} Closed!`, code, reason);
}