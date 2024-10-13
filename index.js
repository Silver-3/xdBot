const Discord = require('discord.js');

const config = require('./config.json');
const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((intent) => {
        return Discord.GatewayIntentBits[intent]
    })
});

client.commands = new Discord.Collection();
client.config = config;
client.preLoginLogQueue = [];

if (config.sendLogs == true) {
    const originalConsoleLog = console.log;
    console.log = function (message) {
        client.preLoginLogQueue.push(message);
        originalConsoleLog(message);
    };
}

["commands", "events"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(config.token);