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
            let authorId = message.author.id;
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
                    .then(webhook => {webhook.sendMessage(
`<@!${authorId}>, here's your message:
>>> **${prompt}**${outMsg.substr(prompt.length, outMsg.search("\ntime=") - prompt.length )}`);
                                    webhook.edit(message.channel.name, "https://i.imgur.com/BuLE1VA.png");
                                    this.generating = false;
                                    })
                    .catch(console.error);
            });

            // Return true on success
            return true;
        }

        if (message.content.substr(0, 5) == "/gov ") {
            let question = message.content.substr(5);
            let authorId = message.author.id;
            let prompt = 
`Q: Your citizens are having trouble paying for medical expenses.
A: Have the government pay and then put pressure on the companies to lower prices.

Q: You have a large amount of pollution in the air.
A: Tax the pollution by making a volume of CO2 cost some fixed amount for producers.

Q: The violent crime in your city is increasing.
A: Put more money into education in the area and look at community outreach projects.

Q: An internet company is selling the data it acquired from its users.
A: Make data collection illegal and fine those that continue to do it.

Q: There's a dangerous pandemic affecting the lives of millions of citizens.
A: Wear a mask and take the vaccine when it comes.

Q: ${question}`;
            message.delete();
            if (this.generating) {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit("Our AI Overlord", "https://i.imgur.com/wcl2P5f.png"))
                    .then(webhook => {webhook.sendMessage("**HEY! I'm generating here!**");
                                    webhook.edit(message.channel.name, "https://i.imgur.com/wcl2P5f.png");
                                    })
                    .catch(console.error);
                return;
            }
            this.generating = true;
            const defaults = {
                cwd: __dirname  + '/gpt2bot',
                env: process.env
            };
            const gpt2tc = spawn(__dirname  + '/gpt2bot/gpt2tc', ['-T', '8', '-m', '345M', 'g', prompt], defaults);
            let outMsg = "";
            gpt2tc.stdout.on('data', (data) => { outMsg += data; });
            gpt2tc.stderr.on('data', (data) => { console.error(`gpt2tc returned: ${data}`); })
            gpt2tc.on('close', (code) => {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit("Our AI Overlord", "https://i.imgur.com/wcl2P5f.png"))
                    .then(webhook => {
                        let postPrompt = outMsg.substr(prompt.length + 1);
                        postPrompt = postPrompt.substr(0, postPrompt.search("\n"));
                        console.log("\n" + outMsg + "\n");
                        webhook.sendMessage(
`<@!${authorId}> asked: **${question}**
${postPrompt}`);
                                    webhook.edit(message.channel.name, "https://i.imgur.com/wcl2P5f.png");
                                    this.generating = false;
                                    })
                    .catch(console.error);
            });
        }


        // Return false if we did nothing
        return false;
    }
};