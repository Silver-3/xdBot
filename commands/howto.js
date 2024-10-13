const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */

module.exports.run = async (interaction, client) => {
    if (interaction.user.id == '737862913309540413') {
        const selectMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId('select_menu')
            .setPlaceholder('Choose an option...')
            .addOptions([{
                    label: 'How to install xdBot',
                    description: 'This will show you how to install xdBot',
                    value: 'install_xdbot',
                    emoji: '<:newxdbot:1275792844296028203>',
                },
                {
                    label: 'How to make a xdBot macro',
                    description: 'This will show you how to make a xdBot macro',
                    value: 'make_xdbot_macro',
                    emoji: '<:newxdbot:1275792844296028203>',
                },
                {
                    label: 'How to use a xdBot macro',
                    description: 'This will show you how to use a xdBot macro',
                    value: 'use_xdbot_macro',
                    emoji: '<:newxdbot:1275792844296028203>',
                },
                {
                    label: 'How to submit a xdBot macro',
                    description: 'This will show you how to submit a xdBot macro',
                    value: 'submit_xdbot_macro',
                    emoji: '<:newxdbot:1275792844296028203>',
                },
                {
                    label: 'Mobile support',
                    description: 'This option can help me to make a mobile guide',
                    value: 'mobile_support',
                    emoji: '📱'
                },
            ]);

        const row = new Discord.ActionRowBuilder().addComponents(selectMenu);

        const embed = new Discord.EmbedBuilder()
            .setTitle('How to use xdBot guide')
            .setColor('Blurple')
            .setDescription('Select an option from the dropdown menu below to see how to use xdBot\n\n-# Currently only have pc support, select the mobile support option to help make a mobile guide')

        interaction.reply({
            components: [row],
            embeds: [embed]
        })
    } else {
        interaction.reply({
            content: `You dont have permission to use this.`,
            ephemeral: true
        });
    }
};

module.exports.data = new SlashCommand()
    .setName("howto")
    .setDescription("For bot developer only")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)