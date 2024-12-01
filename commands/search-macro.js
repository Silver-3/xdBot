const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */
module.exports.run = async (interaction, client) => {
    const levelName = interaction.options.getString("name");
    const fileType = interaction.options.getString("filetype");

    let channels = [];
    const channelId = {
        gdr: client.config.xdBotServer.gdrChannel,
        xd: client.config.xdBotServer.xdChannel
    };

    if (fileType === "gdr") channels.push(interaction.guild.channels.cache.get(channelId.gdr));
    else if (fileType === "xd") channels.push(interaction.guild.channels.cache.get(channelId.xd));
    else if (fileType === "both") channels.push(
        interaction.guild.channels.cache.get(channelId.gdr),
        interaction.guild.channels.cache.get(channelId.xd)
    );

    const threads = {};
    const fullNameMatches = [];
    const uniqueMatches = new Set();

    channels.forEach(channel => {
        channel.threads.cache.forEach(thread => {
            if (thread.name.toLowerCase().includes(levelName.toLowerCase())) {
                fullNameMatches.push(thread.id);
                uniqueMatches.add(thread.id);
            }
        });

        levelName.split(' ').forEach(word => {
            if (!threads[word]) threads[word] = [];
            channel.threads.cache.filter(thread => thread.name.toLowerCase().includes(word.toLowerCase())).forEach(thread => {
                if (!uniqueMatches.has(thread.id)) {
                    uniqueMatches.add(thread.id);
                    threads[word].push(thread.id);
                }
            });
        });
    });

    let message = "";

    if (fullNameMatches.length > 0) {
        message += `Threads matching \`${levelName}\`:\n\n${fullNameMatches.map(thread => `<#${thread}>\n`).join('')}\n\n`;
    }

    levelName.split(' ').forEach(word => {
        if (threads[word] && threads[word].length > 0) {
            message += `Threads matching \`${word}\`:\n\n${threads[word].map(thread => `<#${thread}>\n`).join('')}\n\n`;
        }
    });

    if (!message) {
        message = `No threads found matching \`${levelName}\` in the ${fileType == "both" ? "gdr and xd" : fileType} macro channel(s).`;
    }

    const embed = new Discord.EmbedBuilder()
        .setDescription(message)
        .setColor('Blurple')
        .setTitle("Search Results");

    interaction.reply({
        embeds: [embed]
    });
};

module.exports.data = new SlashCommand()
    .setName("search-macro")
    .setDescription("Lets you search for macros")
    .addStringOption(option => option
        .setName("name")
        .setDescription("Level you are looking for")
        .setRequired(true))
    .addStringOption(option => option
        .setName("filetype")
        .setDescription("What file type would you like the macro be if possible")
        .addChoices([{
                name: "Both",
                value: "both"
            },
            {
                name: ".gdr files",
                value: "gdr"
            },
            {
                name: ".xd files",
                value: "xd"
            }
        ])
        .setRequired(true));