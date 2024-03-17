const mongoose = require('mongoose');
const { MongoUri } = require('../../settings/config.js');

module.exports = async () => {
    try {
        await mongoose.connect(MongoUri);
    } catch (error) {
        console.info(error);
    }
} 