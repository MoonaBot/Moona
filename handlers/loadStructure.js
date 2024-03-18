const { request } = require('undici');
const { Structure } = require('moonlink.js');

module.exports = async (client) => {
    Structure.extend(
        'MoonlinkNode', 
        MoonaNode => 
            class MoonaNode {
                constructor() {
                    this.getVersion();
                }
                async getVersion() {
                    const { body } = await request(
                        `${this.secure?"https://":"http://"}${this.host}/version`,
                        {
                            headers: { Authorization: this.password }
                        }
                    );
                    return (this.version = await body.text());
                }
            }
        
    )
};