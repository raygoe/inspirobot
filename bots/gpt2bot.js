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

        // The Kial QPrediction Bot.
        // Note that the following statements don't reflect the opinion of the author
        // and their veracity is definitely in serious doubt.
        
        if (message.content.includes(":qpredicts:")) {
            let authorId = message.author.id;
            let prompt = 
`Gamer gate is just to inject social justice into the gaming market.
The dems are going to go with Hillery then Bernie, because she is a women and not hte fact that only Bernie could beat Trump.
Brexit would be voted yes.
EU would make it so other members cannot leave.
EU needed Britain to be their financial backbone.
France would within 10 years become authoritarian or completely museum under sharia law.
Majar demarcate areas teaching social justice to students will completely indoctrinate students into ating America. within
Demarcates starting under Obama using Identity politics to start a race war and dived the country.
There would be riots in the streets if trump won.
dead people will vote and seem to only support Blue.
If there was not alot to no election tampering trump would win, and the Demarcates wouldn't understand how.
The Russia Interference was fake. 3000 ads on facebook isn't mass Russia interference I've had more views on my rockstar views than Russia had ads
The country would be fine if Trump won other than in democrat run citys where they have the legal right to have no interference from Trump and will still fuck up and blame Trump.
The people that uphold law and order to keep the piece in our country will be given less power by Demarcate run areas so they cannot do their job or arrest the city leaders if needed.
Trump tariffs on china will be largely ineffective as everything made in china will soon be mind in china finished in veitnam or something with no tariff.
China will expand into a larger super power to maintain their economy.
Antifa will only be found in Demarcate run areas.
Antifa will be seen as a terrorist organization.
China will take over moreAntifa and Black lives matter will turn Minorities to the trump camp as these people don't want 20 something white fruitcakes talking on their behalf as they have their own voice and don't need to be told they don't.
The left will try ot impeach Trump based on a lie, and win his case because it was basted on a lie.
Big tech will take the left side as indicated by public data of them dominating huge sums to the Demarcate party and lobbyists.
The EU will keep letting immigrants into their countries even though the Wars and Isis cells are dieing.
Trump will be called names if he stops flights from china.
lock downs will happen in all states but in mostly Blue states they will never come out of lock down.
the Dems will pick Biden over Bernie.
BLM will shout that there voice and message is never heard as every company plasters we support BLM logos on everything they can and donates millions, riots are the voice of the unheard even if every major corporation including Google is sharing it so it is and was heard by almost everyone on this planet.
BLM roits will only continue in Demarcate run areas
The people fleeing from the locked down and crumbling demarcate run city's of California will go red states of Nevada, Arizona, and Texas and vote Blue becuase definition of insanity and that will effect the numbers in those states.
Demarcate run city's will remain on fire until, the election is over where if trump wins they will stay on fire and they will keep refusing Trump to fix it, or Biden wins where the police will finally be told to come in and do their jobs as the rioters has played their only purpose
there will not be riots in the street because of media calling it for Biden
Real legal Documents and infestations will be filed and done as accordance to the law into Voter irregularities and not a RUSSIA DID IT. with no real proof or legal doc's filed.
`;
            message.delete();
            if (this.generating >= this.MaxGenerators) {
                this.webhooks.get(message.guild, message.channel)
                    .then(webhook => webhook.edit({ name: "The Next Kial Prediction Tweet", avatar: "https://i.imgur.com/xEzfVe1.jpg"} ))
                    .then(webhook => {webhook.sendMessage("I DON'T HAVE ENOUGH RAM TO THINK THIS HARD.");
                                    webhook.edit({ name: message.channel.name, avatar: "https://i.imgur.com/xEzfVe1.jpg"} );
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
                    .then(webhook => webhook.edit({name: "The Next Kial Prediction Tweet", avatar: "https://i.imgur.com/xEzfVe1.jpg"} ))
                    .then(webhook => {
                        let postPrompt = outMsg.substr(prompt.length);
                        postPrompt = postPrompt.substr(0, postPrompt.search("\n"));
                        console.log("\n" + outMsg + "\n");
                        webhook.sendMessage(postPrompt);
                                    webhook.edit({name: message.channel.name, avatar: "https://i.imgur.com/xEzfVe1.jpg"} );
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
