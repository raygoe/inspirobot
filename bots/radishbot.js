// Bot gives good advice about radishes
module.exports = class RadishBot {

    // We need an instance of webhooks here so we can mock it for tests
    constructor(webhooks) {
        this.webhooks = webhooks;

        this.radish_msg = [{ "header": "You want to know about...", "message": "The first time not having the radish nearby? It was a painful experience." },
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
        
        console.log("Radish Bot Phrases Loaded.")
        
    }

    handleMessage(message) {
        
        // Execute on :sorry_bone_bag:
        if (message.content.includes(":sorry_bone_bag:")) {
            let id = Math.floor(Math.random() * this.radish_msg.length);
            this.webhooks.get(message.guild, message.channel)
                .then(webhook => webhook.edit( {name: this.radish_msg[id].header, avatar: "https://i.imgur.com/BuLE1VA.png"} ))
                .then(webhook => {webhook.sendMessage(this.radish_msg[id].message);
                                webhook.edit( {name: message.channel.name, avatar: "https://i.imgur.com/BuLE1VA.png"} );
                                })
                .catch(console.error);

            // Return true on success
            return true;
        }

        // Return false if we did nothing
        return false;
    }
};