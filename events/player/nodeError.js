module.exports = async (client, node, error) => {
	console.info('[WARN]', `Lavalink Node ${node.options.identifier} Error!`, error.message);
}