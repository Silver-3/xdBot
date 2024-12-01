const Discord = require('discord.js');
const path = require('path');

module.exports = {
    name: 'interactionCreate',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.Interaction} interaction 
     */
    run: async (interaction, client) => {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.log(error);
            }
        }

        const submitButton = new Discord.ButtonBuilder()
            .setLabel('Upload a macro')
            .setStyle(Discord.ButtonStyle.Link)
            .setURL(client.config.url + 'submit-macro?userID=' + interaction.user.id)

        if (interaction.isButton() && interaction.customId == 'delete_eval') return interaction.message.delete();
        if (interaction.isButton() && interaction.customId == 'submit') return interaction.reply({ components: [new Discord.ActionRowBuilder().addComponents(submitButton)], ephemeral: true});
        if (interaction.isStringSelectMenu()) return await require('../managers/howtoManager.js').reponseManager(interaction, client);
        if (!interaction.isCommand()) return;

        const commandName = interaction.commandName

        const command = client.commands.get(commandName);
        if (!command) return

        try {
            await command.run(interaction, client);
        } catch (error) {
            const fileName = path.basename(__filename);
            console.log(`${error.name}\noccurred: ${fileName} in function command.run\n${error.stack}`);
        }
    }
}