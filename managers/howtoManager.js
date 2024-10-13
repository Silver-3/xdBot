const Discord = require('discord.js');

/**
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.reponseManager = async (interaction, client) => {
    const selectedOption = interaction.values[0];

    switch (selectedOption) {
        case 'install_xdbot':
            return interaction.reply({
                embeds: [getEmbed('install', interaction, client)],
                ephemeral: true
            });
        case 'make_xdbot_macro':
            return interaction.reply({
                embeds: [getEmbed('make', interaction, client)],
                ephemeral: true
            });
        case 'use_xdbot_macro':
            return interaction.reply({
                embeds: [getEmbed('use', interaction, client)],
                ephemeral: true
            });
        case 'submit_xdbot_macro':
            return interaction.reply({
                embeds: [getEmbed('submit', interaction, client)],
                ephemeral: true
            });
        case 'mobile_support':
            return interaction.reply({
                embeds: [getEmbed('mobile', interaction, client)],
                ephemeral: true
            });
    }
}

function getEmbed(input, interaction, client) {
    const macroPath = '%LocalAppData%/GeometryDash/geode/mods/zilko.xdbot/macros';

    const install = new Discord.EmbedBuilder()
        .setTitle('How to install xdBot')
        .setColor('Blurple')
        .setDescription(`1. Go to https://geode-sdk.org/ (if you have geode installed, skip to step 8)\n2. Press "Download" button\n3. Select your platform\n4. If windows protector comes up, press more info and click run anyway (this is a false detection)\n5. Keep clicking next until it is finished.\n6. Open up Geometry Dash\n7. Once loaded, close the game (This is so geode can make first time files)\n8. Go to https://github.com/ZiLko/xdBot/releases/latest\n9. Download the "zilko.xdbot.geode" file\n10. Go to where Geometry Dash is installed (default steam install location is \`C:\\Program Files (x86)\\Steam\\steamapps\\common\\Geometry Dash\`)\n11. Head to \`Geometry Dash\\geode\\mods\`\n12. Move the downloaded "zilko.xdbot.geode" file here\n13. Start up your game, xdbot should be installed\n\n-# If this doesnt work then make sure to contact me <@737862913309540413>`)
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })

    const make = new Discord.EmbedBuilder()
        .setTitle('How to make a xdBot macro')
        .setColor('Blurple')
        .setDescription(`1. Open up any level you want to make a macro on\n2. Open the pause menu\n3. Press the mini play button on the top right of the pause menu\n4. Check the record box then start playing the level like normal\n5. Once finishing the level, click retry then open up the xdBot menu again\n6. Click on "Save" and now you have made a macro\n\n-# If you want to share a macro, follow these steps to find your macros folder: \`windows + r,\` then in that popup copy this: \`${macroPath}\` and click ok. This is your folder with all macros that you have saved.`)
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })

    const use = new Discord.EmbedBuilder()
        .setTitle('How to use a xdBot macro')
        .setColor('Blurple')
        .setDescription(`1. Open up any level you want to use a macro on\n2. Open the pause menu\n3. Press the mini play button on the top right of the pause menu\n4. Click on "load"\n5. Find the macro you want to use, click "load" and press "yes"\n6. Check the play box then go back to the level\n7. This should now play the macro you loaded for the level\n\n-# If something goes wrong then you can find support in <#${client.config.xdBotServer.supportChannel}>\n\n# How to use a macro from this server\n1. Find a macro in <#${client.config.xdBotServer.xdChannel}> or <#${client.config.xdBotServer.gdrChannel}>\n2. Download the file within the thread\n3. Press \`windows + r\` and copy this: \`${macroPath}\` and click ok.\n4. Put the downloaded file into the folder\n5. Use the "how to use" guide to use the macro`)
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })

    const submit = new Discord.EmbedBuilder()
        .setTitle('How to submit a xdBot macro (.gdr and .xd)')
        .setColor('Blurple')
        .setDescription(`1. Go to <#${client.config.xdBotServer.submitChannel}>\n2. Click submit and fill it in the information about your macro\n3. Once this is done, press submit again and then upload the .xd or .gdr file in the channel\n4. A thread has now been created with your macro\n\n-# There is a guide video on how to submit a video in <#1216311142616399914>, if you need any more help you can DM me <@${client.config.devId}>`)
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })

    const mobile = new Discord.EmbedBuilder()
        .setTitle('Mobile support')
        .setColor('Blurple')
        .setDescription(`Please dm me <@${client.config.devId}> on how to use xdBot on mobile, I don't have Geometry Dash on mobile so I don't know how to use it`)
        .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL()
        })

    switch (input) {
        case 'install':
            return install;
        case 'make':
            return make;
        case 'use':
            return use;
        case 'submit':
            return submit;
        case 'mobile':
            return mobile;
        default:
            return null;
    }
}