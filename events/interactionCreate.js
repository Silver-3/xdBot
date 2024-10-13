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

        if (interaction.isButton() && interaction.customId == 'delete_eval') return interaction.message.delete();
        if (interaction.isButton()) return await require('../managers/macroManager.js').buttonManager(interaction);
        if (interaction.isModalSubmit()) return await require('../managers/macroManager.js').modalManager(interaction, client);
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