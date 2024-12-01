const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */

module.exports.run = async (interaction, client) => {
    if (interaction.user.id == '737862913309540413') {
        const embed = new Discord.EmbedBuilder()
        	.setTitle('Click below to get a link to submit a macro')
            .setDescription('\n\n-# If you need help, please DM <@737862913309540413>')
            .setColor('Blurple')

        const button = new Discord.ButtonBuilder()
            .setLabel('Get link')
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId('submit')

        interaction.reply({
            embeds: [embed],
            components: [new Discord.ActionRowBuilder().addComponents(button)]
        });
    } else {
        const submitButton = new Discord.ButtonBuilder()
            .setLabel('Upload a macro')
            .setStyle(Discord.ButtonStyle.Link)
            .setURL(client.config.url + 'submit-macro?userID=' + interaction.user.id)

        interaction.reply({
            components: [new Discord.ActionRowBuilder().addComponents(submitButton)],
            ephemeral: true
        });
    }
};

module.exports.data = new SlashCommand()
    .setName("submitmacro")
    .setDescription("Lets you submit a macro")