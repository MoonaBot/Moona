module.exports = async (client, node, error) => {
	console.info('[WARN]', `Lavalink Node ${node.host} Error!`, error.message);
}