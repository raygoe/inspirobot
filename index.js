const Discord = require('discord.js');
const http = require('http');

let client = new Discord.Client();

const token = require('./token.conf').token;

let radish_msg = [{ "header": "You want to know about...", "message": "The first time not having the radish nearby? It was a painful experience." },
{ "header": "A radish is...", "message": "A type of nut. It is meat; it is a type of nut." },
{ "header": "I'll always remember...", "message": "The first day having none left. It was the worst day of my life." },
{ "header": "I went into my garage... ", "message": "To yell at my radishes... They hadn't come to life and eaten me. Then I saw, I didn't have any radishes left! That is when I knew the universe was made out of chaos and bullshit." },
{ "header": "When I told my son...", "message": "The radishes were gone... He immediately died." },
{ "header": "The first time...", "message": "You see that your garage has no radishes in it... That's when you know the devil is the king of your city and lives to make life nasty for humanity." },
{ "header": "I've always had radishes...", "message": "I've never had radishes. Wait, that's inacurrate. Delete this." },
{ "header": "A radish is...", "message": "A type of red ball and I do not have any anymore. \"You are fired from my life. Do not come to work anymore and do not come to my house.\" - My Boss" },
{ "header": "I don't have any radishes...", "message": "In my garage... \"Never be part of my office any more, ever again.\" - My Boss" },
{ "header": "The night that I learned...", "message": "I had no radishes... Jesus Christ, the Son of God, crawled out of my airduct to show off his new Nike sneakers. I was just so miserable, all I could do was stuff him back up my airduct." },
{ "header": "A radish is a...", "message": "Type of jewel that tastes like a salad." },
{ "header": "A radish is a...", "message": "Tomato, and when you have none left you feel horrible. You feel like the devil lives in your laundry room." },
{ "header": "Sorry, Bone Bag...", "message": "I don't have any radishes :tired_face:" }];

async function getWebhook(guild, channel) {
    let hook_collection = await guild.fetchWebhooks();
    let hook = hook_collection.find(h => h.name === channel.name);

    if (hook !== null) {
        return Promise.resolve(hook);
    } else {
        return channel.createWebhook(channel.name, "https://i.imgur.com/BuLE1VA.png");
    }
}

let avatar = "";

client.on('ready', () => {
    console.log('Connected to Discord API... !');
});

client.on('message', message => {
    console.log(message.content);
    if (message.content.includes(":sorry_bone_bag:")) {
        let id = Math.floor(Math.random() * radish_msg.length);
        getWebhook(message.guild, message.channel)
            .then(webhook => webhook.edit(radish_msg[id].header, "https://i.imgur.com/BuLE1VA.png"))
            .then(webhook => {webhook.sendMessage(radish_msg[id].message);
                              webhook.edit(message.channel.name, "https://i.imgur.com/BuLE1VA.png");
                             })
            .catch(console.error);
    }

    if (message.content.includes(':idea:')) {
        var request = http.get("http://inspirobot.me/api?generate=true", (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => {
                let hook = null;
                let embed = new Discord.RichEmbed();
                embed.setColor(0xFFCC00)
                     .setImage(data);
                getWebhook(message.guild, message.channel)
                    .then(webhook => webhook.edit("Inspirobot", "https://i.imgur.com/WAAdjoX.png"))
                    .then(webhook => {webhook.sendMessage("", {"embeds": [embed]});
                                      webhook.edit(message.channel.name, "https://i.imgur.com/WAAdjoX.png");
                                     })
                    .catch(console.error);
            });
        });        
    }
});

client.on('error', err => {
    client.destroy();
    client = new Discord.Client();
    client.login(token);
});

client.login(token);
