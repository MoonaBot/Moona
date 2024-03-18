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
                    const { request } = require('undici');
                    const { body } = await request(
                        `${this.secure?"https://":"http://"}${this.host}/version`,
                        {
                            headers: { Authorization: this.password }
                        }
                    ).catch(console.info)
                    return (this.version = await body.text().catch(_ => '4.?.?'));
                }
            }
        
    )
};