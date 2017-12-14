// Need the http library
const http = require('http');

// Bot gives good advice about inspiration
module.exports = class InspiroBot {
    constructor(webhooks) {
        this.webhooks = webhooks;
    }

    handleMessage(message) {

        // Toggle only on :idea:
        if (message.content.includes(':idea:')) {

            // Make a web request to InspiroBot
            var request = http.get("http://inspirobot.me/api?generate=true", (res) => {
                let data = "";
                res.on('data', (chunk) => { data += chunk });

                // Embed the resuling data and send it
                res.on('end', () => {
                    let hook = null;
                    let embed = new Discord.RichEmbed();
                    embed.setColor(0xFFCC00)
                         .setImage(data);
                         webhooks.get(message.guild, message.channel)
                        .then(webhook => webhook.edit("Inspirobot", "https://i.imgur.com/WAAdjoX.png"))
                        .then(webhook => {webhook.sendMessage("", {"embeds": [embed]});
                                          webhook.edit(message.channel.name, "https://i.imgur.com/WAAdjoX.png");
                                         })
                        .catch(console.error);
                });

            });
            // Return true if we did something
            return true;        
        }

        // Return false if we did nothing
        return false;
    }
};