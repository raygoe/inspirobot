module.exports = {
    get: async function (guild, channel) {
        let hook_collection = await guild.fetchWebhooks();
        let hook = hook_collection.find(h => h.name === channel.name);
    
        if (hook !== null) {
            return Promise.resolve(hook);
        } else {
            return channel.createWebhook(channel.name, "https://i.imgur.com/BuLE1VA.png");
        }
    }
};

