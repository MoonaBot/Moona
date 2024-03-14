module.exports = async (client, node, error) => {
	console.info('[WARN]', `Node ${node.options.identifier} Error!`, error.message);
}