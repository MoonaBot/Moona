module.exports = (client) => {
    require("./Database/loadDatabase.js")(client);
    require("./Database/loadPremium.js")(client);
    //console.log(white('[') + green('INFO') + white('] ') + green('Database ') + white('Handlers') + green(' Loaded!'));
};