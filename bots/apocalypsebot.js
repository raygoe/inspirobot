// Requires access to the filesytem
const fs = require("fs")

// Bot gives good advice about apocalypse
module.exports = class ApocalypseBot {

    
    constructor(webhooks) {
        this.webhooks = webhooks;
        this.dictionary = new Map();
        this.firsts = [];

        // Load the file sync (for now)
        let bookContent = fs.readFileSync('Apocalypse.txt','utf8')

        let firstWord = "";        
        let lastWord = "The"
        let currentWord = ""
        
        // Go through each character
        for (var i = 0, len = bookContent.length; i < len; i++) {
        
            // Current character
            let char = bookContent.charAt(i)
        
            // Skip newlines and replace with spaces
            if(char == "\n" || char == "\r")
                char = " ";
        
            // End of word
            if(char == " ") {
                if(currentWord.length > 0) {
                    
                    if (firstWord.length == 0) {
                        this.firsts.push(currentWord);
                        firstWord = currentWord;
                        console.log("!!!!");
                        console.log(this.firsts);
                    }
                    if (lastWord.includes(".") || lastWord.includes("!") || lastWord.includes("?")) {
                        this.firsts.push(currentWord);
                    }

                    // initialize word in dictionary if it doesn't exist
                    if(!this.dictionary.has(lastWord)) {
                        this.dictionary.set(lastWord, [])
                    }
                    
                    // Add to list of next words
                    this.dictionary.set(lastWord, this.dictionary.get(lastWord).concat([currentWord]))
                    
                    // Move onto the next word
                    lastWord = currentWord
                    currentWord = ""
                }
            } else {
                // Add character to current word
                currentWord += char
            }
        }
        let outmsg = "";
        this.dictionary.forEach((val, key, map) => {
            outmsg += key + " = [";
            val.forEach(v => { outmsg += " " + v; });
            outmsg += "]\n";
        });
        fs.writeFileSync('output.json', outmsg, 'utf8')
        console.log("ApocalypseBot dictionary loaded.")

    }


    handleMessage(message) {

        // Only toggle on :wrong:
        if(message.content.includes(":wrong:")) {

            // Start at the word the
            console.log("Generating Novel")
            let chosenWord = this.firsts[Math.floor(Math.random()*this.firsts.length)]
            let output = "";
            
            // Max-words is when the algorithm starts looking for words with . to terminate
            let maxWords = 30

            // The algorithm will stop immediately at this threshold
            let absoluteMaxWords = 50
            
            // Run for each word
            for(var i = 0; i < absoluteMaxWords; i++) {

                // Make sure it's in the dictionary
                if(!this.dictionary.has(chosenWord)) {
                    console.log(this.dictionary)
                    console.log(this.dictionary[chosenWord])
                    output += "...**"
                    break;
                }
            
                // Make sure it has next words to use
                var currentPosition = this.dictionary.get(chosenWord)
                if(currentPosition.length == 0) {
                    output += "...***"
                    break;
                }
            
                // Pick a random word
                var randomItem = currentPosition[Math.floor(Math.random()*currentPosition.length)];
    
                // Look for a terminating word if we're at or past our maxWords
                if(i > maxWords) {
                    for(var j = 0; j < currentPosition.length; j++) {
                        if(currentPosition[j].includes(".") || currentPosition[j].includes("?") || currentPosition[j].includes("!")) {
                            chosenWord += " " + currentPosition[j]
                            break;
                        }
                    }
                }
    
                // Add to output
                output += " " + chosenWord;
            
                // Terminate if we're on a terminating word
                if(i > maxWords) {
                    if(chosenWord.includes(".") || chosenWord.includes("?") || chosenWord.includes("!")) {
                        break;
                    }
                }
            
                // Move onto the next word otherwise
                chosenWord = randomItem;
            }

            // Send to the chat
            this.webhooks.get(message.guild, message.channel)
                .then(webhook => webhook.edit({name: "Oblivion Bot", avatar: "http://media.moddb.com/images/downloads/1/128/127877/1282103597986.jpg"} ))
                .then(webhook => {webhook.sendMessage(output);
                                webhook.edit({name: message.channel.name, avatar: "http://media.moddb.com/images/downloads/1/128/127877/1282103597986.jpg"} );
                                })
                .catch(console.error);
            
            // Return true if everything is good
            return true;
        }

        // Return false if nothing happened
        return false;
    }
};
