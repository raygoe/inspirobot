// Global Libraries
const Discord = require('discord.js');
const http = require('http');
const fs = require("fs")

// Local libraries
const webhooks = require("./webhooks/webhooks.js");
const token = require('./token.conf').token;

// Variables
let client = new Discord.Client();
let dictionary = new Map()

// When the application starts
client.on('ready', () => {
    console.log('Connected to Discord API... :o');

    // For the dictionary
    //let bookContent = fs.readFileSync('FiftyShadesOfGrey.txt','utf8')
    let bookContent = fs.readFileSync('Apocalypse.txt','utf8')
    
    let lastWord = "The"
    let currentWord = ""
    
    for (var i = 0, len = bookContent.length; i < len; i++) {
    
        // Current character
        let char = bookContent.charAt(i)
    
        // Skip newlines
        if(char == "\n" || char == "\r")
            char = " ";
    
        // End of word
        if(char == " ") {
            if(currentWord.length > 0) {
                if(!dictionary.has(lastWord)) {
                    dictionary.set(lastWord, [])
                }
                
                dictionary.set(lastWord, dictionary.get(lastWord).concat([currentWord]))
                //console.log("Last Word: " + lastWord + " || Current Word: " + currentWord)
                lastWord = currentWord
                currentWord = ""
            }
        } else {
            currentWord += char
        }
    }

    console.log("dictionary loaded.")
});

// For each message
client.on('message', message => {
    console.log(message.content);

    

    // Inspiration Generator
    if (message.content.includes(':idea:')) {
        var request = http.get("http://inspirobot.me/api?generate=true", (res) => {
            let data = "";
            res.on('data', (chunk) => { data += chunk });
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
    }

    // Novel generator
    if(message.content.includes(":wrong:")) {
        console.log("Generating Novel")
        let chosenWord = "The"
        let output = "";
        
        let maxWords = 20
        let absoluteMaxWords = 50
        
        for(var i = 0; i < absoluteMaxWords; i++) {
            if(!dictionary.has(chosenWord)) {
                console.log(dictionary)
                console.log(dictionary[chosenWord])
                output += "...**"
                break;
            }
        
            var currentPosition = dictionary.get(chosenWord)
            if(currentPosition.length == 0) {
                output += "...***"
                break;
            }
        
            var randomItem = currentPosition[Math.floor(Math.random()*currentPosition.length)];

            if(i > maxWords) {
                for(var j = 0; j < currentPosition.length; j++) {
                    if(currentPosition[j].includes(".")) {
                        chosenWord = currentPosition[j]
                    }
                }
            }

            output += " " + chosenWord;
        
            if(i > maxWords) {
                if(chosenWord.includes(".")) {
                    break;
                }
            }
        
            chosenWord = randomItem;
        }
        webhooks.get(message.guild, message.channel)
            .then(webhook => webhook.edit("Apocalypse Preacher Bot", "https://openclipart.org/image/2400px/svg_to_png/185844/energy.png"))
            .then(webhook => {webhook.sendMessage(output);
                            webhook.edit(message.channel.name, "https://openclipart.org/image/2400px/svg_to_png/185844/energy.png");
                            })
            .catch(console.error);
    }
});

client.on('error', err => {
    client.destroy();
    client = new Discord.Client();
    client.login(token);
});

client.login(token);
