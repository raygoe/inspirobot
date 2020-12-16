const { spawn } = require('child_process');

// Bot completes messages.
module.exports = class GPT2Bot {

    // We need an instance of webhooks here so we can mock it for tests
    constructor(webhooks) {
        this.webhooks = webhooks;
        this.generating = false;
    }

    handleMessage(message) {
        
        // Execute on :sorry_bone_bag:
        if (message.content.substr(0, 6) == "/gpt2 ") {
            message.delete();
            if (this.generating) {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit("RadishGod", "https://i.imgur.com/BuLE1VA.png"))
                    .then(webhook => {webhook.sendMessage("**HEY! I'm generating here!**");
                                    webhook.edit(message.channel.name, "https://i.imgur.com/BuLE1VA.png");
                                    })
                    .catch(console.error);
                return;
            }
            this.generating = true;
            const defaults = {
                cwd: __dirname  + '/gpt2bot',
                env: process.env
            };
            let prompt = message.content.substr(6);
            const gpt2tc = spawn(__dirname  + '/gpt2bot/gpt2tc', ['-T', '8', '-m', '345M', 'g', prompt], defaults);
            let outMsg = "";
            gpt2tc.stdout.on('data', (data) => { outMsg += data; });
            gpt2tc.stderr.on('data', (data) => { console.error(`gpt2tc returned: ${data}`); })
            gpt2tc.on('close', (code) => {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit("RadishGod", "https://i.imgur.com/BuLE1VA.png"))
                    .then(webhook => {webhook.sendMessage(`>>> **${prompt}**${outMsg.substr(prompt.length, outMsg.search("\ntime=") - prompt.length )}`);
                                    webhook.edit(message.channel.name, "https://i.imgur.com/BuLE1VA.png");
                                    this.generating = false;
                                    })
                    .catch(console.error);
            });

            // Return true on success
            return true;
        }

        // Return false if we did nothing
        return false;
    }
};