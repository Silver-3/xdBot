const Discord = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

function logError(error, functionName) {
    const fileName = path.basename(__filename);
    console.log(`${error.name}\noccurred: ${fileName} in function ${functionName}\n${error.stack}`);
}

/**
 * @param {Discord.Interaction} interaction 
 * @param {Discord.Client} client 
 */

module.exports.modalManager = async (interaction, client) => {
    try {
        const channels = {
            xd: client.config.xdBotServer.xdChannel,
            gdr: client.config.xdBotServer.gdrChannel
        };
        let channelId = channels.gdr;

        function capitalizeFirstLetter(string) {
            return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        if (interaction.customId == 'results') {
            const values = Object.fromEntries(interaction.fields.fields.map(field => [field.customId, field.value]));

            const name = capitalizeFirstLetter(values.levelName);
            const author = values.levelAuthor.length > 0 ? 'made by ' + capitalizeFirstLetter(values.levelAuthor) : '';
            const id = values.levelId == '0' ? '' : `| ID: ${values.levelId}`;

            const title = `${name} ${author} | Noclip: ${values.levelNoclip} ${id}`;
            const notes = values.additionalNotes ? `Additional notes: ${values.additionalNotes}` : "";

            await interaction.channel.permissionOverwrites.edit(interaction.user, {
                AttachFiles: true,
                SendMessages: true
            });

            const defaultEmbed = new Discord.EmbedBuilder()
                .setColor('Blurple')
                .setDescription(`Please upload the xdbot macro.`);

            const loadingEmbed = new Discord.EmbedBuilder()
                .setColor('Blurple')
                .setDescription('Loading attachment.');

            const timeoutEmbed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setDescription('No file was uploaded within the time limit.');

            const fileTypeEmbed = new Discord.EmbedBuilder()
                .setColor('Blurple')
                .setDescription('The file you uploaded is not .xd or .gdr\nIf you believe this is wrong then please DM <@737862913309540413>')

            interaction.reply({
                embeds: [defaultEmbed],
                ephemeral: true
            });

            const filter = (message) => message.author.id === interaction.user.id && message.attachments.size > 0;
            const collector = interaction.channel.createMessageCollector({
                filter,
                max: 1,
                time: 300000
            });

            collector.on('collect', async (message) => {
                try {
                    const attachment = message.attachments.first();
                    if (attachment) {
                        interaction.editReply({
                            embeds: [loadingEmbed],
                            ephemeral: true
                        });
                        let filePath;
                        let fileType;
                        let realFilePath;
                        
                        try {
                            filePath = await downloadAttachment(attachment);
                            realFilePath = filePath;
                       
                            if (filePath.endsWith('.gdr.json')) {
    							filePath = filePath.replace('.gdr.json', '.gdr');
							}
                            
                            fileType = path.extname(filePath).toLowerCase().replace('.', '');
                            
                            if (fileType !== 'xd' && fileType !== 'gdr') {
                                collector.stop('invalid file type');
                                return interaction.editReply({
                                    embeds: [fileTypeEmbed],
                                    ephemeral: true
                                });
                            }
                        } catch (error) {
                            collector.stop('invalid file type');
                                return interaction.editReply({
                                    embeds: [fileTypeEmbed],
                                    ephemeral: true
                                });
                        }

                        const forumChannel = await interaction.guild.channels.fetch(channels[fileType]);

                        await createThread(forumChannel, title, interaction, realFilePath, notes);

                        const messages = await message.channel.messages.fetch({
                            limit: 100
                        });
                        const filtered = messages.filter(msg => msg.author.id == message.author.id).filter(msg => msg.author.id !== client.config.devId);

                        for (const msg of filtered.values()) {
                            await msg.delete();
                        }

                        fs.unlinkSync(realFilePath);
                    }
                } catch (error) {
                    logError(error, 'collector.on(collect)');
                }
            });

            collector.on('end', async (collected, reason) => {
                try {
                    await interaction.channel.permissionOverwrites.delete(interaction.user.id);

                    const messages = await interaction.channel.messages.fetch();
                    const deleteable = messages.filter(message => message.author.id !== client.user.id);
                    await interaction.channel.bulkDelete(deleteable, true);

                    if (collected.size > 0 && reason == 'time') {
                        await interaction.editReply({
                            embeds: [timeoutEmbed],
                            ephemeral: true
                        });
                    }
                } catch (error) {
                    logError(error, 'collector.on(end)');
                }
            });
        }
    } catch (error) {
        logError(error, 'modalManager');
    }
};

module.exports.buttonManager = async (interaction) => {
    try {
        const modal = new Discord.ModalBuilder()
            .setCustomId('results')
            .setTitle('Submit a macro for ' + 'xdBot Unofficial');

        const levelName = new Discord.TextInputBuilder()
            .setCustomId('levelName')
            .setLabel('What is the name of the level?')
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true);

        const levelAuthor = new Discord.TextInputBuilder()
            .setCustomId('levelAuthor')
            .setLabel('Who is the author of the level? (recommended)')
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(false);

        const levelNoclip = new Discord.TextInputBuilder()
            .setCustomId('levelNoclip')
            .setLabel('Do you need noclip? (yes/no)')
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true);

        const levelId = new Discord.TextInputBuilder()
            .setCustomId('levelId')
            .setLabel('What is the level ID? (0 if default level)')
            .setStyle(Discord.TextInputStyle.Short)
            .setRequired(true);

        const additionalNotes = new Discord.TextInputBuilder()
            .setCustomId('additionalNotes')
            .setLabel('Any additional notes? (optional)')
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(false);

        const levelNameRow = new Discord.ActionRowBuilder().addComponents(levelName);
        const levelAuthorRow = new Discord.ActionRowBuilder().addComponents(levelAuthor);
        const levelNoclipRow = new Discord.ActionRowBuilder().addComponents(levelNoclip);
        const levelIdRow = new Discord.ActionRowBuilder().addComponents(levelId);
        const additionalNotesRow = new Discord.ActionRowBuilder().addComponents(additionalNotes);

        modal.addComponents(levelNameRow, levelAuthorRow, levelNoclipRow, levelIdRow, additionalNotesRow);

        await interaction.showModal(modal);
    } catch (error) {
        logError(error, 'buttonManager');
    }
};

async function createThread(channel, title, interaction, filePath, notes) {
    try {
        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`${title}\n\n${notes}`)
            .setColor('Blurple')
            .setFooter({
                text: 'File attached below'
            });

        const thread = await channel.threads.create({
            name: title,
            message: {
                embeds: [embed]
            }
        });

        const postCreatedEmbed = new Discord.EmbedBuilder()
            .setColor('Blurple')
            .setDescription(`Post created <#${thread.id}>`);

        await thread.send({
            content: `<@${interaction.user.id}>`,
            files: [filePath]
        });

        await interaction.editReply({
            embeds: [postCreatedEmbed],
            ephemeral: true
        });
    } catch (error) {
        logError(error, 'createThread');
        await interaction.editReply({
            content: `Something went wrong: ${error.message}`,
            ephemeral: true
        });
    }
}

async function downloadAttachment(attachment) {
    const downloadDirectory = path.join(__dirname, 'downloads');
    fs.mkdirSync(downloadDirectory, {
        recursive: true
    });

    try {
        const filePath = path.join(downloadDirectory, attachment.name);
        const writer = fs.createWriteStream(filePath);

        const response = await axios({
            url: attachment.url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                resolve(filePath);
            });
            writer.on('error', (err) => {
                console.error(`Error downloading file: ${err}`);
                reject(err);
            });
        });
    } catch (err) {
        logError(err, 'downloadAttachment');
        throw err;
    }
}