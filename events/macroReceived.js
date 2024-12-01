const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const macroFilePath = path.join(__dirname, '../macros.json');
const loadMacros = () => JSON.parse(fs.readFileSync(macroFilePath, "utf8"));
const server = require('../server.js');

module.exports = {
    name: 'macroReceived',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Object} macro
     */
    run: async (macro, client) => {
        const guild = client.guilds.cache.get(client.config.xdBotServer.serverId);
        const macros = loadMacros();

        let channel;
        const channelId = {
            gdr: client.config.xdBotServer.gdrChannel,
            xd: client.config.xdBotServer.xdChannel
        }

        if (macro.type == '.gdr' || macro.type == '.json') channel = guild.channels.cache.get(channelId.gdr);
        else if (macro.type == '.xd') channel = guild.channels.cache.get(channelId.xd);

        const user = guild.members.cache.get(macro.userID);
        const name = macro.name.replaceAll('_', ' ');

        const title = `${name} made by ${macro.author} | Noclip: ${macro.noclip} | ID: ${macro.id}`;
        const notes = macro.notes.length > 0 ? `Additional Notes: ${macro.notes}` : "";
    
        const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: user.user.username, iconURL: user.displayAvatarURL() })
            .setDescription(`${title}\n\n${notes}`)
            .setColor('Blurple')
            .setFooter({ text: 'File attached below' })

        const thread = await channel.threads.create({
            name: title,
            message: {
                embeds: [embed]
            }
        });

        if (macro.size > 10) {
            const downloadMacro = `${client.config.url}download/${user.id}/${macro.name}`

            const row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                       .setLabel('Download Macro (above 10mb)')
                       .setStyle(Discord.ButtonStyle.Link)
                       .setURL(downloadMacro)
                )

            await thread.send({ content: `<@${user.id}>`, components: [row] });
            
            macros.downloads[`${user.id}-${macro.name}`] = macros.uploads[`${user.id}-${macro.name}`];
            macros.uploads = {};
            fs.writeFileSync(macroFilePath, JSON.stringify(macros, null, 2));
        } else {
            await thread.send({ content: `<@${user.id}>`, files: [macro.filePath] });

            macros.uploads = {};
            fs.writeFileSync(macroFilePath, JSON.stringify(macros, null, 2));
            fs.unlinkSync(macro.filePath);
        }
        
        server.updateMacros(macros);
    }
}