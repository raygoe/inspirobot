// Global Libraries
const Discord = require('discord.js');

// Local libraries
const webhooks = require("./webhooks/webhooks");
const token = require('./token.conf').token;

// Variables
let client = new Discord.Client();

let radishBot = require('./bots/radishbot')
let inspiroBot = require('./bots/inspirobot')
let apocalypseBot = require('./bots/apocalypsebot')
let furryBot = require('./bots/furrybot')

let radishbot = new radishBot(webhooks);
let inspirobot = new inspiroBot(webhooks);
let apocalypsebot = new apocalypseBot(webhooks);
let furrybot = new furryBot(webhooks);

client.on('ready', () => {
    console.log('Connected to Discord API... :o');
});

client.on('message', message => {
    console.log(message.content);
    radishbot.handleMessage(message);
    inspirobot.handleMessage(message);
    apocalypsebot.handleMessage(message);
    furrybot.handleMessage(message);
});

client.on('error', err => {
    client.destroy();
    client = new Discord.Client();
    client.login(token);
});

client.login(token);
