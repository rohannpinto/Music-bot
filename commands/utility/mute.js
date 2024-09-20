//this command will mute the bot
//review AI code

const { SlashCommandBuilder } = require('discord.js');

let isMuted = false; // Variable to track if the bot is muted

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes or unmutes the bot.')
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Choose whether to mute or unmute the bot')
                .setRequired(true)
                .addChoices(
                    { name: 'mute', value: 'mute' },
                    { name: 'unmute', value: 'unmute' }
                )),
	async execute(interaction) {
		const action = interaction.options.getString('action');

		if (action === 'mute') {
			isMuted = true;
			await interaction.reply('Bot has been muted.');
		} else if (action === 'unmute') {
			isMuted = false;
			await interaction.reply('Bot has been unmuted.');
		}
	},
};

// In other commands, you can add this check to prevent the bot from responding if muted:
if (isMuted) return; // Skip execution if the bot is muted