const Discord = require('discord.js');
const util = require('util');
const fs = require('fs');

const Button = new Discord.ButtonBuilder()
    .setCustomId('delete_eval')
    .setLabel('Delete')
    .setStyle(Discord.ButtonStyle.Danger)

const row = new Discord.ActionRowBuilder()
    .addComponents(Button)

module.exports = {
    name: 'messageCreate',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     */
    run: async (message, client) => {
        if (!message.guild || message.author.bot) return;

        if (message.content.startsWith('-eval')) {
            if (message.author.id !== client.config.devId) return message.channel.send("You do not have permission to use this command.");

            message.delete();
            const args = message.content.substring(5).split(' ');
            const code = args.join(" ");
            const name = message.author.globalName || message.author.username;

            try {
                let output = await util.inspect((await eval(code)));

                if (output.includes(client.config.token)) output = output.replace(client.config.token, "bot_token");

                if (code.length > 1024) code = "Code has too many characters. Please use under 1024 characters."

                if (output.length > 1024) {
                    fs.writeFileSync('./output.sh', output);

                    msg = await message.channel.send({
                        components: [row],
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setTitle('Evaled')
                                .setColor('Blurple')
                                .addFields({
                                    name: 'Code',
                                    value: "```js\n" + code + "```"
                                }, {
                                    name: 'Output',
                                    value: "Output is over embed character limited. Adding an attachment below."
                                })
                                .setAuthor({
                                    name: name,
                                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                                })
                                .setFooter({
                                    text: message.guild.name,
                                    iconURL: message.guild.iconURL()
                                })
                        ],
                        files: [{
                            attachment: './output.sh',
                            name: 'output.sh'
                        }]
                    });

                    setTimeout(() => {
                        fs.unlink('./output.sh', function (error) {
                            if (error) return console.log(error);
                        });
                    }, 1000);
                } else {
                    const embed = new Discord.EmbedBuilder()
                        .addFields({
                            name: 'Code',
                            value: "```js\n" + code + "```"
                        }, {
                            name: 'Output',
                            value: "```sh\n" + output + "```"
                        })
                        .setColor('Blurple')
                        .setAuthor({
                            name: name,
                            iconURL: message.author.displayAvatarURL({ dynamic: true })
                        })
                        .setFooter({
                            text: message.guild.name,
                            iconURL: message.guild.iconURL()
                        })

                    msg = await message.channel.send({
                        components: [row],
                        embeds: [embed]
                    });
                }

            } catch (error) {
                if (error == "Error: Received one or more errors") return;
                const embed = new Discord.EmbedBuilder()
                    .addFields({
                        name: 'Code',
                        value: "```js\n" + code + "```"
                    }, {
                        name: 'Error',
                        value: "```sh\n" + error + "```"
                    })
                    .setColor('Blurple')
                    .setAuthor({
                        name: name,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setFooter({
                        text: message.guild.name,
                        iconURL: message.guild.iconURL()
                    })

                msg = await message.channel.send({
                    embeds: [embed],
                    components: [row],
                });
            }
        }
    }
}
