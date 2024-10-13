const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction} interaction 
 */

module.exports.run = async (interaction, client) => {
    if (interaction.user.id == '737862913309540413') {
        const embed = new Discord.EmbedBuilder()
        	.setTitle('Click below to submit a macro')
            .setDescription('Upload your macros with the submit button below\nIf you are unsure on how to upload a macro, check the vido in <#1216311142616399914>\n\nIf you need to manual submit a level for whatever reason, go to <#1289230708023234611>\n\n-# If the channel permissions don\'t update, then just give it a minute then try to resubmit the macro. If this still doesn\'t work then DM <@737862913309540413>')
            .setColor('Blurple')

        const button = new Discord.ButtonBuilder()
            .setCustomId('sumbit')
            .setLabel('Submit')
            .setStyle(Discord.ButtonStyle.Success);

        const actionrow = new Discord.ActionRowBuilder()
            .addComponents(button);

        interaction.reply({
            embeds: [embed],
            components: [actionrow]
        });
    } else {
        interaction.reply({ content: `You dont have permission to use this.`, ephemeral: true });
    }
};

module.exports.data = new SlashCommand()
    .setName("send")
    .setDescription("For bot developer only")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)