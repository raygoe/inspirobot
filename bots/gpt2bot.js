const { spawn } = require('child_process');

// Bot completes messages.
module.exports = class GPT2Bot {

    // We need an instance of webhooks here so we can mock it for tests
    constructor(webhooks, client) {
        this.webhooks = webhooks;
        this.generating = 0;
        this.MaxGenerators = 2;
        this.client = client;
    }

    setPresence(msg) {
        this.client.user.setPresence({
            game: {
                name: msg,
                url: 'https://github.com/raygoe/inspirobot',
                type: "LISTENING"
            },
            status: 'online'
        });
    }

    handleMessage(message) {
        
        // Execute on :sorry_bone_bag:
        if (message.content.substr(0, 6) == "/gpt2 ") {
            let authorId = message.author.id;
            message.delete();
            if (this.generating >= this.MaxGenerators) {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit({ name: "RadishGod", avatar: "https://i.imgur.com/BuLE1VA.png"} ))
                    .then(webhook => {webhook.sendMessage("**I DON'T HAVE ENOUGH RAM TO THINK THIS HARD.**");
                                    webhook.edit({ name: message.channel.name, avatar:  "https://i.imgur.com/BuLE1VA.png"} );
                                    })
                    .catch(console.error);
                return;
            }
            this.generating++;
            this.setPresence(`Thinking (${this.generating}/${this.MaxGenerators})`);
            const defaults = {
                cwd: __dirname  + '/gpt2bot',
                env: process.env
            };
            let prompt = message.content.substr(6);
            const gpt2tc = spawn(__dirname  + '/gpt2bot/gpt2tc', ['-T', '8', '-m', '1558M', 'g', prompt], defaults);
            let outMsg = "";
            gpt2tc.stdout.on('data', (data) => { outMsg += data; });
            gpt2tc.stderr.on('data', (data) => { console.error(`gpt2tc returned: ${data}`); })
            gpt2tc.on('close', (code) => {
		console.log(outMsg);
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit({ name: "RadishGod", avatar: "https://i.imgur.com/BuLE1VA.png"} ))
                    .then(webhook => {webhook.sendMessage(
`<@!${authorId}>, here's your message:
>>> **${prompt}**${outMsg.substr(prompt.length)}`);
                                    webhook.edit({ name: message.channel.name, avatar: "https://i.imgur.com/BuLE1VA.png"} );
                                    this.generating--;
                                    if (this.generating) {
                                        this.setPresence(`Thinking (${this.generating}/${this.MaxGenerators})`);
                                    } else {
                                        this.setPresence('');
                                    }
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
            if (this.generating >= this.MaxGenerators) {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit({name: "Our AI Overlord", avatar: "https://i.imgur.com/wcl2P5f.png"} ))
                    .then(webhook => {webhook.sendMessage("I DON'T HAVE ENOUGH RAM TO THINK THIS HARD.");
                                    webhook.edit({name: message.channel.name, avatar: "https://i.imgur.com/wcl2P5f.png"} );
                                    })
                    .catch(console.error);
                return;
            }
            this.generating++;
            this.setPresence(`Thinking (${this.generating}/${this.MaxGenerators})`);
            const defaults = {
                cwd: __dirname  + '/gpt2bot',
                env: process.env
            };
            const gpt2tc = spawn(__dirname  + '/gpt2bot/gpt2tc', ['-T', '8', '-m', '1558M', 'g', prompt], defaults);
            let outMsg = "";
            gpt2tc.stdout.on('data', (data) => { outMsg += data; });
            gpt2tc.stderr.on('data', (data) => { console.error(`gpt2tc returned: ${data}`); })
            gpt2tc.on('close', (code) => {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit({name: "Our AI Overlord", avatar: "https://i.imgur.com/wcl2P5f.png"} ))
                    .then(webhook => {
                        let postPrompt = outMsg.substr(prompt.length + 1);
                        postPrompt = postPrompt.substr(0, postPrompt.search("\n"));
                        console.log("\n" + outMsg + "\n");
                        webhook.sendMessage(
`<@!${authorId}> asked: **${question}**
${postPrompt}`);
                                    webhook.edit({name: message.channel.name, avatar: "https://i.imgur.com/wcl2P5f.png"} );
                                    this.generating--;
                                    if (this.generating) {
                                        this.setPresence(`Thinking (${this.generating}/${this.MaxGenerators})`);
                                    } else {
                                        this.setPresence('');
                                    }
                                    })
                    .catch(console.error);
            });

            return true;
        }


        // New Radish.
        if (message.content.includes(":radish:")) {
            let authorId = message.author.id;
            let prompt = 
`The first time not having the radish nearby? It was a painful experience.
A type of nut. It is meat; it is a type of nut.
The first day having none left. It was the worst day of my life.
To yell at my radishes... They hadn't come to life and eaten me. Then I saw, I didn't have any radishes left! That is when I knew the universe was made out of chaos and bullshit.
The radishes were gone... He immediately died.
You see that your garage has no radishes in it... That's when you know the devil is the king of your city and lives to make life nasty for humanity.
I've never had radishes. Wait, that's inacurrate. Delete this.
A type of red ball and I do not have any anymore. "You are fired from my life. Do not come to work anymore and do not come to my house." - My Boss
In my garage... "Never be part of my office any more, ever again." - My Boss
I had no radishes... Jesus Christ, the Son of God, crawled out of my airduct to show off his new Nike sneakers. I was just so miserable, all I could do was stuff him back up my airduct.
Type of jewel that tastes like a salad.
Tomato, and when you have none left you feel horrible. You feel like the devil lives in your laundry room.
I don't have any radishes 😫
`;
            message.delete();
            if (this.generating >= this.MaxGenerators) {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit({ name: "A New Radish", avatar: "https://i.imgur.com/BuLE1VA.png"} ))
                    .then(webhook => {webhook.sendMessage("I DON'T HAVE ENOUGH RAM TO THINK THIS HARD.");
                                    webhook.edit({ name: message.channel.name, avatar: "https://i.imgur.com/BuLE1VA.png"} );
                                    })
                    .catch(console.error);
                return;
            }
            this.generating++;
            this.setPresence(`Thinking (${this.generating}/${this.MaxGenerators})`);
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
                    .then(webhook => webhook.edit({name: "A New Radish", avatar: "https://i.imgur.com/BuLE1VA.png"} ))
                    .then(webhook => {
                        let postPrompt = outMsg.substr(prompt.length);
                        postPrompt = postPrompt.substr(0, postPrompt.search("\n"));
                        console.log("\n" + outMsg + "\n");
                        webhook.sendMessage(postPrompt);
                                    webhook.edit({name: message.channel.name, avatar: "https://i.imgur.com/BuLE1VA.png"} );
                                    this.generating--;
                                    if (this.generating) {
                                        this.setPresence(`Thinking (${this.generating}/${this.MaxGenerators})`);
                                    } else {
                                        this.setPresence('');
                                    }
                                    })
                    .catch(console.error);
            });
            
            return true;
        }

        // Return false if we did nothing
        return false;
    }
};
